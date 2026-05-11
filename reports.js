async function fetchData(url) {
    const res = await fetch(url);
    return await res.json();
}

// Load all report data
async function loadReportData() {
    try {
        const [drugData, regionData, monthlyData] = await Promise.all([
            fetchData('/sales-by-drug'),
            fetchData('/sales-by-region'),
            fetchData('/monthly-sales')
        ]);

        updatePerformanceMetrics(drugData, regionData, monthlyData);
        updateRegionalAnalysis(regionData);
        updateMonthlyTrends(monthlyData);
        updateDrugPerformance(drugData);

        loadPerformanceChart(monthlyData);
        loadRegionalChart(regionData);
        loadTrendsChart(monthlyData);
        loadDrugPerformanceChart(drugData);

    } catch (error) {
        console.error('Error loading report data:', error);
    }
}

function updatePerformanceMetrics(drugData, regionData, monthlyData) {
    // Total Revenue
    const totalRevenue = drugData.reduce((sum, item) => sum + item.Sales, 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;

    // Average Monthly Sales
    const avgMonthly = monthlyData.length > 0 ? Math.round(totalRevenue / monthlyData.length) : 0;
    document.getElementById('avgMonthly').textContent = `$${avgMonthly.toLocaleString()}`;

    // Growth Rate (comparing first and last month)
    if (monthlyData.length >= 2) {
        const firstMonth = monthlyData[0].Sales;
        const lastMonth = monthlyData[monthlyData.length - 1].Sales;
        const growthRate = ((lastMonth - firstMonth) / firstMonth * 100).toFixed(1);
        document.getElementById('growthRate').textContent = `${growthRate}%`;
    }

    // Top Drug
    const topDrug = drugData.reduce((max, item) => item.Sales > max.Sales ? item : max, drugData[0]);
    document.getElementById('topDrug').textContent = topDrug.Drug;
}

function updateRegionalAnalysis(regionData) {
    const totalSales = regionData.reduce((sum, item) => sum + item.Sales, 0);

    regionData.forEach(region => {
        const percentage = ((region.Sales / totalSales) * 100).toFixed(1);
        const element = document.getElementById(`${region.Region.toLowerCase()}Region`);

        if (element) {
            element.querySelector('.region-value').textContent = `$${region.Sales.toLocaleString()}`;
            element.querySelector('.progress-fill').style.width = `${percentage}%`;
        }
    });
}

function updateMonthlyTrends(monthlyData) {
    if (monthlyData.length === 0) return;

    const currentMonth = monthlyData[monthlyData.length - 1];
    const lastMonth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : currentMonth;

    document.getElementById('currentMonth').textContent = `$${currentMonth.Sales.toLocaleString()}`;
    document.getElementById('lastMonth').textContent = `$${lastMonth.Sales.toLocaleString()}`;

    const change = ((currentMonth.Sales - lastMonth.Sales) / lastMonth.Sales * 100).toFixed(1);
    const changeElement = document.getElementById('monthChange');
    changeElement.textContent = `${change}%`;
    changeElement.className = `trend-change ${change >= 0 ? 'positive' : 'negative'}`;

    // Peak month
    const peakMonth = monthlyData.reduce((max, item) => item.Sales > max.Sales ? item : max, monthlyData[0]);
    document.getElementById('peakMonth').textContent = `$${peakMonth.Sales.toLocaleString()}`;
    document.getElementById('peakMonthName').textContent = peakMonth.Month;
}

function updateDrugPerformance(drugData) {
    const sortedDrugs = drugData.sort((a, b) => b.Sales - a.Sales);

    for (let i = 0; i < Math.min(3, sortedDrugs.length); i++) {
        const drug = sortedDrugs[i];
        const element = document.getElementById(`drug${i + 1}`);

        if (element) {
            element.querySelector('.drug-name').textContent = drug.Drug;
            element.querySelector('.drug-sales').textContent = `$${drug.Sales.toLocaleString()}`;
        }
    }
}

function loadPerformanceChart(monthlyData) {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.map(d => d.Month),
            datasets: [{
                label: 'Monthly Sales',
                data: monthlyData.map(d => d.Sales),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function loadRegionalChart(regionData) {
    const ctx = document.getElementById('regionalChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regionData.map(d => d.Region),
            datasets: [{
                label: 'Regional Sales',
                data: regionData.map(d => d.Sales),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function loadTrendsChart(monthlyData) {
    const ctx = document.getElementById('trendsChart').getContext('2d');

    new Chart(ctx, {
        type: 'area',
        data: {
            labels: monthlyData.map(d => d.Month),
            datasets: [{
                label: 'Sales Trend',
                data: monthlyData.map(d => d.Sales),
                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function loadDrugPerformanceChart(drugData) {
    const ctx = document.getElementById('drugPerformanceChart').getContext('2d');

    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: drugData.map(d => d.Drug),
            datasets: [{
                label: 'Drug Sales',
                data: drugData.map(d => d.Sales),
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Export functionality (placeholder)
document.addEventListener('DOMContentLoaded', function() {
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Export functionality will be implemented in the next version!');
        });
    });

    loadReportData();
});