var Dashboard = {
    init: function () {
        this.bindElements();
        this.loadData();
        this.initCharts();
    },
    bindElements: function () {
        this.totalEmitidasElement = document.getElementById('totalEmitidas');
        this.semCobrancaElement = document.getElementById('semCobranca');
        this.inadimplenciaElement = document.getElementById('inadimplencia');
        this.aVencerElement = document.getElementById('aVencer');
        this.pagasElement = document.getElementById('pagas');
    },
    loadData: function () {
        ApiService.fetchData('/notes/indicators', (res) => {
            this.totalEmitidasElement.innerHTML = `${formatCurrency(res?.totalEmitidas)}`;
            this.semCobrancaElement.innerHTML = `${formatCurrency(res?.semCobranca)}`;
            this.inadimplenciaElement.innerHTML = `${formatCurrency(res?.inadimplencia)}`;
            this.aVencerElement.innerHTML = `${formatCurrency(res?.aVencer)}`;
            this.pagasElement.innerHTML = `${formatCurrency(res?.pagas)}`;
        });

    },
    initCharts: function () {
        const inadimplenciaOptions = {
            chart: {
                type: 'line',
                height: 350
            },
            series: [{
                name: 'Inadimplência',
                data: [1500, 2000, 1800, 2100, 1900, 2300, 2200]
            }],
            xaxis: {
                categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']
            }
        };

        const inadimplenciaChart = new ApexCharts(document.querySelector("#inadimplenciaChart"), inadimplenciaOptions);
        inadimplenciaChart.render();

        const receitaOptions = {
            chart: {
                type: 'bar',
                height: 350
            },
            series: [{
                name: 'Valor recebido',
                data: [5000, 6000, 7000, 8000, 9000, 8500, 9200]
            }],
            xaxis: {
                categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']
            }
        };

        const receitaChart = new ApexCharts(document.querySelector("#receitaChart"), receitaOptions);
        receitaChart.render();
    }
};


$(document).ready(function () {
    Dashboard.init();
});
