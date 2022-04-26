import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, push, ref, set, child, get, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd7fq4voVJpd-nXzjNysQFPLRuNO7hDPY",
  authDomain: "budget-app-81451.firebaseapp.com",
  databaseURL: "https://budget-app-81451-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "budget-app-81451",
  storageBucket: "budget-app-81451.appspot.com",
  messagingSenderId: "233009066288",
  appId: "1:233009066288:web:ef55ca2ee8bf75d362d8f5",
  measurementId: "G-P88P79R5ZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
let currentTransform = 0; //for categoryPagination.
const defaultBudgetType = ['salary', 'gift', 'friend', 'invoice', 'shopping', 'others']

window.onload = () => {
  renderBudgetItemList()
  handleRenderCategory()
  totalBudget();
}

function totalBudget() {
  let db = ref(getDatabase());
  let totalBudget = 0;
  get(child(db, 'income'))
  .then((snapshot) => {
    for (let budgetType in snapshot.val()) {
      for (let item in snapshot.val()[budgetType]) {
        totalBudget += parseInt(snapshot.val()[budgetType][item].money);
      }
    }
  })
  .then(() => {
    get(child(db, 'cost'))
    .then((snapshot) => {
      for (let budgetType in snapshot.val()) {
        for (let item in snapshot.val()[budgetType]) {
          totalBudget -= parseInt(snapshot.val()[budgetType][item].money);
        }
      }
    })
    .then(() => {
      document.querySelector('.app__header-total').innerText = '$ ' + totalBudget;
    })
  })
}

function handleRenderCategory() {
  let db = ref(getDatabase())
  get(child(db, 'category'))
  .then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
  })
  .then((snapshot) => {
    let htmls = [`
      <div class="budget-type__item" onclick="showAddModal('Salary')">
          <div class="item-img-container">
              <img src="./assets/img/salary.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Salary</h4>
      </div>
      <div class="budget-type__item" onclick="showAddModal('Gift')">
          <div class="item-img-container">
              <img src="./assets/img/gift.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Gift</h4>
      </div>
      <div class="budget-type__item" onclick="showAddModal('Friend')">
          <div class="item-img-container">
              <img src="./assets/img/friend.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Friend</h4>
      </div>
      <div class="budget-type__item" onclick="showAddModal('Shopping')">
          <div class="item-img-container">
              <img src="./assets/img/shopping.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Shopping</h4>
      </div>
      <div class="budget-type__item" onclick="showAddModal('Invoice')">
          <div class="item-img-container">
              <img src="./assets/img/invoice.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Invoice</h4>
      </div>`
    ]
    for (let item in snapshot) {
      let imgPath = defaultBudgetType.filter(e => snapshot[item].type === e)
      let html = `
        <div class="budget-type__item" onclick="showAddModal('${snapshot[item].type}')">
            <img src="./assets/img/bin.jpg" alt="" class="delete-category" id="${item}">
            <div class="item-img-container">
                <img src="${imgPath.length > 0 ? "./assets/img/" + snapshot[item].type + '.png' :  "./assets/img/unavailable.png"}" alt="" class="item-img">
            </div>
            <h4 class="item-heading">${snapshot[item].type}</h4>
        </div>
      `
      htmls.push(html)
    }
    document.querySelector('.slider__budget-type').innerHTML = htmls.join('')
  })
  .catch((error) => {
    console.error(error)
  })
  .finally(() => {
    handleChangeCategory();
    document.querySelector('.slider__budget-type').innerHTML += `
      <div class="budget-type__item" id = "add-category">
          <div class="item-img-container">
              <img src="./assets/img/add.png" alt="" class="item-img">
          </div>
          <h4 class="item-heading">Others</h4>
      </div>
    `
    document.getElementById('add-category').addEventListener('click', () => {
      document.querySelector('.modal-category-wrapper').classList.remove('hidden')
      document.querySelector('.cancel-category').onclick = () => {
        document.querySelector('.modal-category-wrapper').classList.add('hidden')
        document.querySelector('#input-category-name').value = '';
      }
      document.querySelector('.create-category').onclick = () => {
        let type = document.querySelector('#input-category-name');
        addCategory(type);
      }
    })
    document.querySelectorAll('.delete-category').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Warning: Delete this type will delete all data related to this type! This action can\'t be undone! Proceed?')) {
          const db = getDatabase();
          get(child(ref(getDatabase()), 'category'))
          .then((snapshot) => {
            const categoryRef = ref(db,`category/${e.target.id}`)
            const costRef = ref(db,`cost/${snapshot.val()[e.target.id].type}`)
            const incomeRef = ref(db,`income/${snapshot.val()[e.target.id].type}`)
            set(categoryRef, null)
            set(costRef, null)
            set(incomeRef, null)
            handleRenderCategory();
            totalBudget();
            renderBudgetItemList();
          })
        }
      })
    })
  })
}

function renderBudgetItemList() {
  const db = ref(getDatabase())
  get(child(db, 'category'))
  .then((categorySnapshot) => {
    let categoryList = []
    for(let item in categorySnapshot.val()) {
      categoryList.push(categorySnapshot.val()[item])
    }
    get(child(db, 'income'))
    .then((incomeSnapshot) => {
      handleRenderBudgetList(incomeSnapshot, categoryList, 'income')
      document.querySelectorAll('.budget-income__item-delete').forEach( element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete this list?')) {
            const db = getDatabase();
            const categoryRef = ref(db,`income/${e.target.id}`)
            set(categoryRef, null)
            renderBudgetItemList()
            totalBudget();
          }
        })
      })

      let budgetIncomeList = document.querySelectorAll('.budget-income__item')
      budgetIncomeList.forEach((budgetIncome) => {
        budgetIncome.addEventListener('click', (e) => {
          document.querySelector('.modal-details-wrapper').classList.remove('hidden')
          let db = ref(getDatabase())
          get(child(db, 'income/' + budgetIncome.id))
          .then(snapshot => {
            handleRenderBudgetItemList(snapshot, 'income', budgetIncome)
          })
        })
      })
    })
    get(child(db, 'cost'))
    .then((costSnapshot) => {
      handleRenderBudgetList(costSnapshot, categoryList, 'cost')
      document.querySelectorAll('.budget-cost__item-delete').forEach( element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete this list?')) {
            const db = getDatabase();
            const categoryRef = ref(db,`cost/${e.target.id}`)
            set(categoryRef, null)
            renderBudgetItemList()
            totalBudget();
          }
        })
      })

      let budgetCostList = document.querySelectorAll('.budget-cost__item')
      budgetCostList.forEach((budgetCost) => {
        budgetCost.addEventListener('click', (e) => {
          document.querySelector('.modal-details-wrapper').classList.remove('hidden')
          let db = ref(getDatabase())
          get(child(db, 'cost/' + budgetCost.id))
          .then(snapshot => {
            handleRenderBudgetItemList(snapshot, 'cost', budgetCost)
          })
        })
      })
    })
  })
}

function handleRenderBudgetList(snapshot, categoryList, budgetType) {
  let htmls = [];
  for (let category in snapshot.val()) {
    let totalCategoryBudget = 0;
    let date;
    for (let item in snapshot.val()[category]) {
      totalCategoryBudget += parseInt(snapshot.val()[category][item].money);
      date = snapshot.val()[category][item].date;
    }
    let imgPath = defaultBudgetType.filter(e => category === e)
    let html = `
    <li class="budget-${budgetType}__item" id = "${category}">
    <img src="./assets/img/bin.jpg" class = "budget-${budgetType}__item-delete" alt=""  id="${category}">
          <div class="${budgetType}-item__img">
            <img src="${imgPath.length > 0 ? "./assets/img/" + category + '.png' :  "./assets/img/unavailable.png"}" alt="" class="item-img">
          </div>
          <div class="${budgetType}-item__details">
              <h4 class="${budgetType}-item__heading">
                  ${category} ${budgetType}
              </h4>
              <p class="${budgetType}-item__money">$${totalCategoryBudget}</p>
              <p class="${budgetType}-item__create-date">${date}</p>
          </div>
      </li>
    `
    htmls.push(html)
  }
  document.querySelector(`.budget-${budgetType}__list`).innerHTML = htmls.join('')
}

function handleRenderBudgetItemList(snapshot, budgetType, budgetItem) {
  let htmls = [];
  let total = 0;
  for (let item in snapshot.val()) {
    let categoryImgPath = defaultBudgetType.filter(e => e === budgetItem.id)
    total += parseInt(snapshot.val()[item].money);
    let html = `
    <li class="budget-item">
        <div class="${budgetType}-item__img">
            <img src="${categoryImgPath.length > 0 ? './assets/img/' + categoryImgPath[0] +'.png' : './assets/img/unavailable.png'}" alt="">
        </div>
        <div class="budget-content">
            <div class="budget-heading">
                <span class="budget-name">${snapshot.val()[item].head}</span>
                <span class="budget-money">
                  : ${snapshot.val()[item].money}$
                </span> 
            </div>
            <p class="budget-description">${snapshot.val()[item].description}</p>
            <p class="budget-create-date">${snapshot.val()[item].date}</p>
        </div>
      </li>
    `
    htmls.push(html)
  }
  document.querySelector('.modal-details__heading').innerHTML = `
    <span class="total-money">
        $${total}
    </span> ${budgetItem.id}  ${budgetType}
  `
  handlePagination(htmls);
}

function handlePagination(htmls) {
  document.querySelector('.modal-details__list').innerHTML = htmls.join('')
  document.querySelector('.modal-details__list').style.setProperty('--transformValue', `0%`)
  document.querySelector('.modal-details__list').style.setProperty('--widthValue', `${Math.ceil(htmls.length / 3) * 100 > 0 ? Math.ceil(htmls.length / 3) * 100 : 100}%`)
  let currentTransform = 0;
  let maxWidth = 100;
  let step = 100/Math.ceil(htmls.length / 3);
  const prevPagination = document.querySelector('.modal-pagination__left')
  const nextPagination = document.querySelector('.modal-pagination__right')
  if (currentTransform == 0)
    prevPagination.classList.add('disabled')
  else 
    prevPagination.classList.remove('disabled')
  
  if (currentTransform == -maxWidth + (Math.ceil(htmls.length / 3) * 100))
    nextPagination.classList.add('disabled')
  else
    nextPagination.classList.remove('disabled')
  nextPagination.onclick = (e) => {
    currentTransform -= step;
    document.querySelector('.modal-details__list').style.setProperty('--transformValue', `${currentTransform}%`)
    if (currentTransform < 0)
      prevPagination.classList.remove('disabled')
    if (currentTransform <= -maxWidth + step)
      nextPagination.classList.add('disabled')
  }
  prevPagination.onclick = (e) => {
    currentTransform += step;
    document.querySelector('.modal-details__list').style.setProperty('--transformValue', `${currentTransform}%`)
    if (currentTransform >= -maxWidth)
      nextPagination.classList.remove('disabled')
    if (currentTransform == 0)
      prevPagination.classList.add('disabled')
  }
}

function handleChangeCategory() {
  const prevBtn = document.querySelector('.slider__btn-left');
  const newPrevBtn = prevBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  const nextBtn = document.querySelector('.slider__btn-right');
  const newNextBtn = nextBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
  let transformMax = Math.ceil((document.querySelectorAll('.budget-type__item').length + 1) / 6) * 100 - 100;
  if (currentTransform <= -transformMax) {
    newNextBtn.disabled = true;
  } else {
    newNextBtn.disabled = false;
  }
  if (currentTransform == 0) {
    newPrevBtn.disabled = true;
  } else {
    newPrevBtn.disabled = false;
  }
  newNextBtn.addEventListener('click', () => {
    currentTransform -= 100;
    document.querySelector('.slider__budget-type').style.transform = `translateX(${currentTransform}%)`
    newPrevBtn.disabled = false;
    if (currentTransform <= -transformMax)
      newNextBtn.disabled = true;
  })
  newPrevBtn.addEventListener('click', () => {
    currentTransform += 100;
    document.querySelector('.slider__budget-type').style.transform = `translateX(${currentTransform}%)`
    newNextBtn.disabled = false;
    if (currentTransform == 0)
      newPrevBtn.disabled = true;
  })
}

function addBudget(budgetType, incomeType, head, description, money) {
  const budgetListRef = ref(db, `${budgetType}/${incomeType}`);
  const budgetRef = push(budgetListRef);
  let date = new Date();
  let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  set(budgetRef, {
    head: head,
    description: description,
    money: money,
    date: date.toLocaleDateString('vn-VN', options),
  })
}

function addCategory(type) {
  let categoryDb = ref(getDatabase())
  get(child(categoryDb, 'category'))
  .then((snapshot) => {
    for (let item in snapshot.val()) {
      if (defaultBudgetType.includes(type.value.toLowerCase().trim()))
        return true;
      else if (snapshot.val()[item].type.toLowerCase().trim() === type.value.toLowerCase().trim())
        return true;
    }
    return false;
  })
  .then((isExists) => {
    if (isExists) {
      alert('Budget type already exist, please choose another name for budget type!')
    } else {
      const categoryListRef = ref(db, 'category')
      const categoryRef = push(categoryListRef);
      if (type.value) {
        set(categoryRef, {
          type: type.value,
        })
        .then(() => {
          document.querySelector('.modal-category-wrapper').classList.add('hidden')
          type.value = '';
        })
        handleRenderCategory()
      } else {
        alert('Please fill all category info!')
      }
    }
  })
}

document.querySelector('.confirm-btn').addEventListener('click', () => {
  let budgetType = document.querySelector('input[name="type"]:checked');
  let incomeType = document.querySelector('#modal-add__heading').innerText.substring(document.querySelector('#modal-add__heading').innerText.lastIndexOf(' ') + 1).toLowerCase()
  let head = document.querySelector('#input-heading');
  let description = document.querySelector('.input-description');
  let money = document.querySelector('#input-money');
  if (money <= 0) {
    alert('Money have to greater than 0$')
  }
  else if (validateItem(budgetType) && validateItem(head) && validateItem(description) && validateItem(money)) {
    addBudget(budgetType.value, incomeType, head.value, description.value, money.value);
    document.querySelector('#modal-add__heading').innerText.substring(document.querySelector('#modal-add__heading').innerText.lastIndexOf(' ') + 1)
    document.querySelector('#input-heading').value = '';
    document.querySelector('#input-money').value = '';
    document.querySelector('.input-description').value = '';
    document.querySelector('input[name="type"]:checked').checked = false
    document.querySelector('.modal-add-wrapper').classList.add('hidden');
    totalBudget();
    renderBudgetItemList();
  } else {
    alert('Please fill out all infomations!')
  }
})

function validateItem(item) {
  if (item && item.value)
    return true;
  return false;
}

document.querySelector('.cancel-btn').addEventListener('click', () => {
  document.querySelector('.modal-add-wrapper').classList.add('hidden');
  document.querySelector('#input-heading').value = '';
  document.querySelector('#input-money').value = '';
  document.querySelector('.input-description').value = '';

  document.querySelector('.modal-add-wrapper').classList.add('hidden');
})

document.querySelector('.close-btn').addEventListener('click', () => {
  document.querySelector('.modal-details-wrapper').classList.add('hidden')
})


