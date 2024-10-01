
function renderPagination(currentPage, totalPages) {
    const paginationLimit = 5;
    let pages = [];

    // Thêm trang trước đó (Previous)
    if (currentPage > 1) {
        pages.push(`
            <li class="page-item">
                <button class="page-link" onclick="fetchJobs(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i> <!-- Biểu tượng mũi tên -->
                </button>
            </li>
        `);
    } else {
        pages.push(`
            <li class="page-item">
                <button class="page-link">
                    <i class="fas fa-chevron-left"></i> <!-- Biểu tượng mũi tên -->
                </button>
            </li>
        `);
    }

    if (totalPages > paginationLimit) {
        const startPage = Math.max(1, currentPage - Math.floor(paginationLimit / 2));
        const endPage = Math.min(totalPages, currentPage + Math.floor(paginationLimit / 2));

        if (startPage > 1) {
            pages.push(`
                <li class="page-item">
                    <button class="page-link" onclick="fetchJobs(1)">1</button>
                </li>
                <li class="page-item disabled"><span class="page-link">...</span></li>
            `);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" onclick="fetchJobs(${i})">${i}</button>
                </li>
            `);
        }

        if (endPage < totalPages) {
            pages.push(`
                <li class="page-item disabled"><span class="page-link">...</span></li>
                <li class="page-item">
                    <button class="page-link" onclick="fetchJobs(${totalPages})">${totalPages}</button>
                </li>
            `);
        }
    } else {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" onclick="fetchJobs(${i})">${i}</button>
                </li>
            `);
        }
    }

    // Thêm trang tiếp theo (Next)
    if (currentPage < totalPages) {
        pages.push(`
            <li class="page-item">
                <button class="page-link" onclick="fetchJobs(${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i> <!-- Biểu tượng mũi tên -->
                </button>
            </li>
        `);
    } else {
        pages.push(`
            <li class="page-item">
                <button class="page-link">
                    <i class="fas fa-chevron-right"></i> <!-- Biểu tượng mũi tên -->
                </button>
            </li>
        `);
    }

    return pages.join('');
}


// Lấy chuỗi truy vấn từ URL
const queryString = window.location.search;

// Tạo đối tượng URLSearchParams
const urlParams = new URLSearchParams(queryString);

// Lấy giá trị của tham số 'name' và 'age'
const query = urlParams.get('query');
if (query != null){
    document.getElementById('searchInput').value = query;
}

function fetchJobs(page = 1) {
    var url = query!=null?`https://jobproj.xelanthantoc.workers.dev/api/job/search?res=${query}&page=${page}&pageSize=9`:`https://jobproj.xelanthantoc.workers.dev/api/job/search?page=${page}&pageSize=9`;
    $.ajax({
        url: url,
        method: 'GET',
        xhrFields: {
            withCredentials: true // Để gửi cookies
        },
        success: function(result) {
            const jobsResult = result.jobs;
            const jobsList = document.getElementById('jobs-list');
            const jobPage = document.getElementById('pagination');
            const authButtons = document.getElementById('auth-buttons');
            const currentPage = result.currentPage;
            const totalPages = result.totalPages;
            var i = (currentPage - 1 ) * result.pageSize + 1;
            // Hiển thị danh sách công việc
            if (jobsResult.length > 0) {
                jobsList.innerHTML = jobsResult.map(job =>
                    `<tr>
                        <th scope="row">${i++}</th>
                        <td>${job.jobs.id}</td>
                        <td>${job.jobs.title}</td>
                        <td class="text-end">
                            <button type="button" onclick="redirectUrl(${job.jobs.id})" class="btn btn-success">Sửa</button>
                        </td>
                    </tr>`
                ).join('');
                
                // Cập nhật phân trang
                jobPage.innerHTML = renderPagination(currentPage, totalPages);
            } else {
                jobsList.innerHTML = 'Không có công việc nào.';
            }

            
        },
        error: function(xhr, status, error) {
            console.error('Lỗi khi lấy danh sách công việc:', error);
        }
    });
}



document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    window.location.href = `https://deadinside.pages.dev/public/admin?query=${query}`
});

// Gọi hàm để tải dữ liệu khi trang được tải
fetchJobs();

function redirectUrl(id){
    window.location.href = `https://deadinside.pages.dev/public/updatejob?id=${id}`;
}


  