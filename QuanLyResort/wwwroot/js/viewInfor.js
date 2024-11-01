
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(userInfo);
    if (userInfo && userInfo.userId) {
        fetchUserData(userInfo.userId);
    }
    else {
        console.log('failed');
    }

});

async function fetchUserData(userID) {
    try {
        const response = await fetch(`/api/User/GetUser/${userID}`);
        const data = await response.json();
        console.log(data);


        if (data && data.data) {
            document.getElementById('firstname').value = data.data.firstName || '';
            document.getElementById('lastname').value = data.data.lastName || '';
            document.getElementById('email-update').value = data.data.email || '';
        } else {
            console.error("Không thể lấy thông tin người dùng:", data.message);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}





