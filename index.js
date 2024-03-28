// Removed require statement since the SDK is included via a script tag in the HTML

const poolData = {
    UserPoolId: 'us-west-2_xokQOkmut', // Your user pool id here
    ClientId: '5omch2gl6iqh2ljp4kf1dpnvdb' // Your client id here
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function signIn(username, password) {
    const authenticationData = {
        Username: username,
        Password: password,
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username: username,
        Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            console.log('Authentication successful', result);

            // Store the JWT token in sessionStorage
            sessionStorage.setItem('jwtToken', result.getAccessToken().getJwtToken());

            // Redirect to the upload page
            window.location.href = 'upload.html';
        },
        onFailure: (err) => {
            console.error('Authentication failed', err);
            alert(err.message || JSON.stringify(err));
        },
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('signInForm'); 
    signInForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        signIn(username, password);
    });
});
