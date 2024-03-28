const apiEndpoint = 'https://4jyzsa7chd.execute-api.us-west-2.amazonaws.com/dev';

window.onload = function() {
    const token = sessionStorage.getItem('jwtToken');
    
    if (!token) {
        alert("You're not authenticated. Please sign in.");
        window.location.href = 'index.html'; // Redirect to sign-in if no token
    } 
};

document.getElementById('uploadForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('imageFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const contentType = file.type;

        try {
            // Fetching a presigned URL from your API, including the filename in the request
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type // This sets the content type correctly
                }) 
            });

            if (response.ok) {
                const responseBody = await response.json();
                
                // The API response's 'body' is a JSON-encoded string, so parse it as JSON
                const data = JSON.parse(responseBody.body);

                const presignedUrl = data.url; // Extracting the presigned URL from the parsed data
                const objectName = data.objectName; // Extracting the object name from the parsed data
                
                // Log the presigned URL and object name to the console
                console.log('Presigned URL:', presignedUrl);
                console.log('Object Name:', objectName);

                // Use the presigned URL to upload the file directly to S3
                const uploadResponse = await fetch(presignedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': contentType // Use the file's actual MIME type
                    },
                    body: file
                });

                if (uploadResponse.ok) {
                    alert('Image uploaded successfully.\n' + `Stored as: ${objectName}`);
                } else {
                    alert('Failed to upload the image.');
                }
            } else {
                // Handle HTTP errors
                console.error('HTTP Error:', response.statusText);
                alert('Failed to fetch presigned URL.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading the image.');
        }
    } else {
        alert('Please select a file to upload.');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('imageFile');
    const fileNameDisplay = document.getElementById('fileName');
    const imagePreview = document.getElementById('imagePreview');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];

        // Display the file name
        fileNameDisplay.textContent = file ? file.name : 'No file chosen';

        // Display an image preview
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };

            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    });
});
