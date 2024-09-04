var Dashboard = {
    init: function () {
        this.bindEvents();
        this.loadData();
    },
    bindEvents: function () {
        $('#button').on('click', this.handleButtonClick);
    },
    loadData: function () {

    }
};
$(document).ready(function () {
    Dashboard.init();
});

document.addEventListener("DOMContentLoaded", function () {
    const totalEmitidasElement = document.getElementById('totalEmitidas');
    const semCobrancaElement = document.getElementById('semCobranca');
    const inadimplenciaElement = document.getElementById('inadimplencia');
    const aVencerElement = document.getElementById('aVencer');
    const pagasElement = document.getElementById('pagas');

    const data = {
        totalEmitidas: 100000,
        semCobranca: 20000,
        inadimplencia: 15000,
        aVencer: 30000,
        pagas: 50000
    };

    totalEmitidasElement.innerHTML = `R$ ${data.totalEmitidas.toFixed(2)}`;
    semCobrancaElement.innerHTML = `R$ ${data.semCobranca.toFixed(2)}`;
    inadimplenciaElement.innerHTML = `R$ ${data.inadimplencia.toFixed(2)}`;
    aVencerElement.innerHTML = `R$ ${data.aVencer.toFixed(2)}`;
    pagasElement.innerHTML = `R$ ${data.pagas.toFixed(2)}`;

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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        }
    };

    const receitaChart = new ApexCharts(document.querySelector("#receitaChart"), receitaOptions);
    receitaChart.render();
});