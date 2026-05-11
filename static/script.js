async function fetchData(url) {
    const res = await fetch(url);
    return await res.json();
}

// Update stats cards
async function updateStats() {
    try {
        const [drugData, regionData, monthlyData] = await Promise.all([
            fetchData('/sales-by-drug'),
            fetchData('/sales-by-region'),
            fetchData('/monthly-sales')
        ]);

        // Calculate total sales
        const totalSales = drugData.reduce((sum, item) => sum + item.Sales, 0);
        document.getElementById('totalSales').textContent = `$${totalSales.toLocaleString()}`;

        // Update other stats
        document.getElementById('totalRegions').textContent = regionData.length;
        document.getElementById('totalProducts').textContent = drugData.length;
        document.getElementById('totalMonths').textContent = monthlyData.length;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Drug Chart
async function loadDrugChart() {
    try {
        const data = await fetchData('/sales-by-drug');

        const labels = data.map(d => d.Drug);
        const values = data.map(d => d.Sales);

        new Chart(document.getElementById('drugChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                return `Sales: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    } catch (error) {
        console.error('Error loading drug chart:', error);
    }
}

// Region Chart
async function loadRegionChart() {
    try {
        const data = await fetchData('/sales-by-region');

        const labels = data.map(d => d.Region);
        const values = data.map(d => d.Sales);

        new Chart(document.getElementById('regionChart'), {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    } catch (error) {
        console.error('Error loading region chart:', error);
    }
}

// Monthly Chart
async function loadMonthlyChart() {
    try {
        const data = await fetchData('/monthly-sales');

        const labels = data.map(d => d.Month);
        const values = data.map(d => d.Sales);

        new Chart(document.getElementById('monthlyChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Sales ($)',
                    data: values,
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointHoverBorderColor: 'white',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        callbacks: {
                            label: function(context) {
                                return `Sales: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    } catch (error) {
        console.error('Error loading monthly chart:', error);
    }
}

// Load all content
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    loadDrugChart();
    loadRegionChart();
    loadMonthlyChart();
});
