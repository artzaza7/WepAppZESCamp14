//Settiog Firestore Database
const db = firebase.firestore()
const auth = firebase.auth()
var user = auth.currentUser
let loginButton = document.getElementById("loginButton")
loginButton.addEventListener('click', adminPage)
function adminPage() {
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            user = userCredential.user
            db.collection("User").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data())
                    var role = doc.data().Role
                    var username = doc.data().Username
                    if (role === 'Admin') { //แก้ไข
                        openAdminPage()
                    }
                    else { //แก้ไข
                        openUserPage(username)
                        handleSubmit(doc.data().Username, doc.data().UID)
                    }
                } else {
                    console.log("No such document!")
                }
            }).catch((error) => {
                console.log("Error getting document:", error)
            })
        })
        .catch((error) => {
            var errorCode = error.code
            var errorMessage = error.message
            console.log("error " + errorCode + " : " + errorMessage)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Don't Have This User In Database OR Password is invalid`,
            })
        })

}
function openAdminPage() {
    alert("Welcome Admin")
    window.location.href = 'admin.html'
}
function openUserPage(username) {
    alert(`Welcome ${username}`)
    window.location.href = 'user.html'
}
function handleSubmit(username, uid){
    localStorage.setItem("USERNAME", username)
    localStorage.setItem("UID", uid)
    return;
}
