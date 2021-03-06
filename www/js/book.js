// Button Press Function to go to page
function bookButton(i) {
    fn.pushPage({
        'id': 'book.html',
        'title': 'Book'
    });
    console.log(i);
    getBooks(i);
}

// Retrieve Books from Backend (Firebase)
function getBooks(i) {
    firebase.database().ref('list/' + i + '').once('value', function(snapshot) {
        var title = snapshot.val().title;
        var author = snapshot.val().author || "None";
        var category = snapshot.val().category || "None";
        var pages = snapshot.val().pages || "None";
        $('#book').append("<ons-card><div class='title'>" + title + "</div><div class='content'><img id='specificBookPic" + i +
            "' style='width:20%; height:35%; text-align: left;'><div style='width:70%; float:right;'><div style='margin-bottom:6%'>Author: " + author +
            "</div><div style='margin-bottom:6%'>Category: " + category +
            "</div><div>Pages: " + pages +
            "</div></div></div></ons-card><section style='margin: 16px'>" +
            "<ons-button modifier='large' class='button-margin' onclick='reserveBook(" + i + ")'>Reserve</ons-button>" +
            "<ons-button modifier='large' class='button-margin' style='margin-top: 5px;' onclick='checkoutBook(" + i + ")'>Checkout</ons-button>" +
            "</section>");
        console.log(i);
        addImage("specific", i);
    });
}

// Place Book on Hold in Backend (Firebase)
function reserveBook(i) {
    var userId = firebase.auth().currentUser.uid;
    console.log(userId);
    logMsg(userId);
    var value = new Date();
    var date = value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear();
    firebase.database().ref('list/' + i + '/reserve').once('value', function(snapshot) {
        if (snapshot.val().reservedBy === "none") {
            ons.notification.confirm('Do you wish to reserve this book?')
                .then(function(input) {
                    if (input) {
                        firebase.database().ref('list/' + i + '/reserve').set({
                            reservedBy: userId,
                            date: date
                        }).then(function() {
                            ons.notification.alert('You have reserved your book until 2 weeks from today');
                        });
                    }
                });
        } else {
            if (snapshot.val().reservedBy === userId) {
                ons.notification.alert('You have already reserved this book.');
            } else {
                ons.notification.alert('You cannot reserve this book because someone else has already reserved it.');
            }
        }
    });
}

// Checkout Books in Backend (Firebase)
function checkoutBook(i) {
    var userId = firebase.auth().currentUser.uid;
    var value = new Date();
    var date = value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear();
    firebase.database().ref('list/' + i + '/checkout').once('value', function(snapshot) {
        if (snapshot.val().checkedoutBy === "none") {
            ons.notification.alert('Navigate to the checkout page in order to check out this book.');

        } else {
            ons.notification.alert('You cannot checkout this book because someone else has already checked it out it.');
        }
    });
}