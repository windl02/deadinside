$(document).ready(function() {
    // Lấy chuỗi truy vấn từ URL
    const queryString = window.location.search;

    // Tạo đối tượng URLSearchParams
    const urlParams = new URLSearchParams(queryString);

    // Lấy giá trị của tham số 'name' và 'age'
    const jobId = urlParams.get('id');
    

    // Gọi API để lấy thông tin job
    $.ajax({
        url: 'https://jobproj.xelanthantoc.workers.dev/api/job/details?id=' + jobId,
        method: 'GET',
        success: function(response) {
            // Gán dữ liệu từ API vào các trường trong form
            var job = response.jobs;
            var company = response.company;
            
            $('#idJob').val(job.id);
            $('#title').val(job.title);
            $('#salary').val(job.salary);
            $('#level').val(job.level);
            $('#exp').val(job.exp);
            $('#quantity').val(job.quantity);
            $('#deadline').val(job.deadline);
            $('#form').val(job.form);
            $('#address').val(job.address);
            $('#companyImage').val(company.image);
            $('#companyName').val(company.name);
            $('#companyAddress').val(company.address);
            $('#companyUrl').val(company.url);
            $('#description').val(job.description);
        },
        error: function(xhr, status, error) {
            alert('Không thể lấy dữ liệu công việc!');
            console.log('Lỗi: ' + error);
        }
    });
});


$(document).ready(function() {
    // Bắt sự kiện submit của form
    $('#updateJobForm').on('submit', function(event) {
        event.preventDefault(); // Ngăn chặn form submit thông thường
        const idJob = $('#idJob').val();
        // Lấy giá trị từ các trường input
        var formData = {
            title: $('#title').val(),
            salary: $('#salary').val(),
            level: $('#level').val(),
            exp: $('#exp').val(),
            quantity: $('#quantity').val(),
            deadline: $('#deadline').val(),
            form: $('#form').val(),
            address: $('#address').val(),
            companyImage: $('#companyImage').val(),
            companyName: $('#companyName').val(),
            companyAddress: $('#companyAddress').val(),
            companyUrl: $('#companyUrl').val(),
            description: $('#description').val()
        };

        // Gửi dữ liệu qua AJAX với phương thức PUT
        $.ajax({
            url: 'https://jobproj.xelanthantoc.workers.dev/api/job/update?id=' + idJob, // API với id từ idJob
            method: 'PUT', // Đổi phương thức thành PUT
            contentType: 'application/json', // Định dạng gửi là JSON
            data: JSON.stringify(formData), // Chuyển formData thành chuỗi JSON
            success: function(response) {
                alert('Cập nhật thành công!'); // Thông báo nếu thành công
                console.log(response); // Xem phản hồi từ server
            },
            error: function(xhr, status, error) {
                alert('Cập nhật thất bại!'); // Thông báo nếu thất bại
                console.log('Lỗi: ' + error); // Hiển thị lỗi
            }
        });
    });
});

