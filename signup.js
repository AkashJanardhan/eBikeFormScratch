// Configuration for your Cognito User Pool
const poolData = {
    UserPoolId: 'us-west-2_xokQOkmut', // Your user pool id here
    ClientId: '5omch2gl6iqh2ljp4kf1dpnvdb' // Your client id here
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to handle the sign-up submission
function signUp(event) {
    event.preventDefault();

    // Use email as the username
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;

    // Amazon Cognito expects attributes as an array
    const attributeList = [];
    const dataEmail = {
        Name: 'email',
        Value: email
    };
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    // Sign up the user with email as username
    userPool.signUp(email, password, attributeList, null, function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        // User was successfully created
        const cognitoUser = result.user;
        console.log('User registration successful:', cognitoUser.getUsername());

        // Inside signUp function, after successful registration
        showVerificationSection(email);


        // Redirect or inform the user to verify their email
        alert('Registration successful. Please check your email to verify your account.');

        
    });
}

function showVerificationSection(email) {
    // Fill the email field automatically if you prefer
    document.getElementById('verifyEmail').value = email;
    document.getElementById('verificationSection').style.display = 'block';
}

function verifyUser() {
    const email = document.getElementById('verifyEmail').value;
    const code = document.getElementById('verificationCode').value;

    const userData = {
        Username: email,
        Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        alert('Account verified successfully!');
        // Optionally redirect the user to the sign-in page or auto-sign-in the user
        window.location.href = 'index.html';
    });
}

// Bind the signUp function to the sign-up form submission event
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signUpForm').addEventListener('submit', signUp);
    document.getElementById('verificationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        verifyUser();
    });
});
