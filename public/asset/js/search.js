
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
            const currentPage = result.currentPage;
            const totalPages = result.totalPages;

            // Hiển thị danh sách công việc
            if (jobsResult.length > 0) {
                jobsList.innerHTML = jobsResult.map(job =>
                    `<div class="col-xl-4 col-md-6">
                        <div class="ec-job-item d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img width="50" height="50" src="${job.company.image}" alt=""
                                class="ec-job-img m-3" />
                            <div class="ec-job-item-content ms-3">
                                <a class="ec-job-name text-dark text-decoration-none" href="https://deadinside.pages.dev/public/details?id=${job.jobs.id}">${job.jobs.title}</a>
                                <div class="ec-job-content-tag mt-2 d-flex flex-wrap">
                                    <div class="ec-job-tag-item">${job.jobs.salary}</div>
                                </div>
                            </div>
                            </div>
                            <div class="ec-job-content-save-btn">
                                <button class="ec-job-save-btn rounded-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16"
                                        viewBox="0 0 12 16" fill="none">
                                        <path
                                            d="M0 2C0 0.895431 0.89543 0 2 0H10C11.1046 0 12 0.89543 12 2V15.5C12 15.6844 11.8985 15.8538 11.7359 15.9408C11.5733 16.0278 11.3761 16.0183 11.2226 15.916L6 13.1009L0.77735 15.916C0.623922 16.0183 0.42665 16.0278 0.264071 15.9408C0.101492 15.8538 0 15.6844 0 15.5V2ZM2 1C1.44772 1 1 1.44772 1 2V14.5657L5.72265 12.084C5.8906 11.972 6.1094 11.972 6.27735 12.084L11 14.5657V2C11 1.44772 10.5523 1 10 1H2Z"
                                            fill="black" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>`
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
    window.location.href = `https://deadinside.pages.dev/public/joblist?query=${query}`
});

// Gọi hàm để tải dữ liệu khi trang được tải
fetchJobs();

function redirectUrl(){
    window.location.href="https://deadinside.pages.dev/public/search"
}
  