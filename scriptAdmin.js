const db = firebase.firestore()


const dragArea = document.querySelector('.drag-area')
const dragText = document.querySelector('.header')

let button = document.querySelector('.button')
let input = document.querySelector('input')

button.onclick = () => {
    input.click()
}

//when browse
input.addEventListener('change', function () {
    file = this.files[0]
    dragArea.classList.add('active')
    displayFile()
})

let file
var type
//when file is inside the drag area
dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragText.textContent = 'Release to Upload'
    dragArea.classList.add('active')
    // console.log("File is inside the drag area")
})

//when file leaves the drag area
dragArea.addEventListener('dragleave', () => {
    dragText.textContent = 'Drag & Drop'
    dragArea.classList.remove('active')

    // console.log("File left the drag area")
})

//when the file is dropped in the drag area
dragArea.addEventListener('drop', (event) => {
    event.preventDefault();

    file = event.dataTransfer.files[0]
    // console.log(file)
    displayFile()

})

function displayFile() {
    let fileType = file.type
    type = fileType
    // console.log(fileType)

    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png']

    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader()
        fileReader.onload = () => {
            let fileURL = fileReader.result
            // console.log(fileURL)
            let imgTag = `<img src="${fileURL}" alt="">`
            // console.log(fileURL)
            dragArea.innerHTML = imgTag
        }
        fileReader.readAsDataURL(file)
    }
    else {
        alert("This file is not a image")
        dragArea.classList.remove('active')
    }
    // console.log("The file is dropped in drag area")
}
//Storage and Database
var buttonUpload = document.getElementById('uploadImage')
buttonUpload.onclick = uploadFile
function uploadFile() {
    var name = document.getElementById('nameOfImage').value
    var des = document.getElementById('description').value
    var price = document.getElementById('price').value
    var storageRef = firebase.storage().ref()
    storageRef.child(`${name}`).put(file).then(() => {
        downloadURL(name, des, price)
    })
    Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
    })
    reset()
}
function downloadURL(name, des, price) {
    var storageRef = firebase.storage().ref()
    // console.log(des);
    // console.log(price);
    storageRef.child(`${name}`).getDownloadURL().then((url) => {
        db.collection('Menu').doc(name).set({
            ImageName: name,
            ImageURL: url,
            Description: des,
            Price: price
        })
    })
}
function reset() {
    const scriptHTML = `
        <div class="icon">
            <i class="fas fa-images"></i>
        </div>

        <span class="header"> Drag & Drop</span>
        <span class="header">or <span class="button">browse</span></span>
        <input type="file" hidden>
        <span class="support">Supports: JPEG, JPG, PNG</span>`
    dragArea.innerHTML = scriptHTML
    document.getElementById('nameOfImage').value = ''
    document.getElementById('description').value = ''
    document.getElementById('price').value = ''
}

let containerCard = document.querySelector('.containerProductList')

function readerCard(doc) {
    let divCard = document.createElement('div')
    divCard.className = "card"

    let divProductImage = document.createElement('div')
    divProductImage.className = "product-image"

    let image = document.createElement('img')

    let divProductInfo = document.createElement('div')
    divProductInfo.className = "product-info"

    let h4Name = document.createElement('h4')
    let h4Price = document.createElement('h4')
    let h4Des = document.createElement('h4')

    let divBtn = document.createElement('div')
    divBtn.className = "btn"

    let button = document.createElement('button')

    divCard.setAttribute('data-name', doc.data().ImageName)
    image.src = doc.data().ImageURL
    h4Name.textContent = doc.data().ImageName
    h4Price.textContent = doc.data().Price + " Bath"
    h4Des.textContent = doc.data().Description
    button.textContent = "Delete from Database"

    divBtn.appendChild(button)
    divProductInfo.appendChild(h4Name)
    divProductInfo.appendChild(h4Price)
    divProductInfo.appendChild(h4Des)
    divProductImage.appendChild(image)
    divCard.appendChild(divProductImage)
    divCard.appendChild(divProductInfo)
    divCard.appendChild(divBtn)

    containerCard.appendChild(divCard)

    button.addEventListener('click', (e) => {
        let parent = e.target.parentElement
        // alert(parent)
        let id = parent.parentElement.getAttribute('data-name')
        db.collection('Menu').doc(id).delete()
        var storageRef = firebase.storage().ref()
        storageRef.child(id).delete()
        Swal.fire({
            icon: 'success',
            title: 'Delete Success',
            showConfirmButton: false,
            timer: 1500
        })
    })
}

// db.collection('Menu').get().then((menu) => {
//     menu.docs.forEach(doc => {
//         console.log(doc.data())
//         readerCard(doc)
//     })
// })

//Upadate Real-Time
db.collection('Menu').onSnapshot(snapshot => {
    let change = snapshot.docChanges()
    change.forEach(change => {
        // console.log(change)
        if (change.type == 'added') {
            readerCard(change.doc)
        }
        else if (change.type == 'removed') {
            let div = containerCard.querySelector(`[data-name=${change.doc.id}]`)
            containerCard.removeChild(div)
        }
    })
})