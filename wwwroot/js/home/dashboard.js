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
        const data = {
            totalEmitidas: 100000,
            semCobranca: 20000,
            inadimplencia: 15000,
            aVencer: 30000,
            pagas: 50000
        };

        this.totalEmitidasElement.innerHTML = `R$ ${data.totalEmitidas}`;
        this.semCobrancaElement.innerHTML = `R$ ${data.semCobranca}`;
        this.inadimplenciaElement.innerHTML = `R$ ${data.inadimplencia}`;
        this.aVencerElement.innerHTML = `R$ ${data.aVencer}`;
        this.pagasElement.innerHTML = `R$ ${data.pagas}`;
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
