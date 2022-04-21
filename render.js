function showAddModal(type) {
    document.querySelector('.modal-add__heading').innerHTML = `Create new: ${type}`
    document.querySelector('.modal-add-wrapper').classList.remove('hidden')
}
