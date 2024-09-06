const statusDescriptions = {
    0: 'Emitida',
    1: 'Cobrança realizada',
    2: 'Pagamento em atraso',
    3: 'Pagamento realizado'
};

function getStatusDescription(statusCode) {
    return statusDescriptions[statusCode] || 'Desconhecido';
}

var Notas = {

    init: function () {
        this.bindElements();
        this.loadData();
        this.bindEvents();
    },

    bindElements: function () {
        this.$issueDateFilter = $('#issueDateFilter');
        this.$billingDateFilter = $('#billingDateFilter');
        this.$paymentDateFilter = $('#paymentDateFilter');
        this.$statusFilter = $('#statusFilter');
        this.$notesTable = $('#notesTable');

        this.$statusSelect = $('#statusFilter');

        this.$notesTableContext;
    },

    loadData: function () {
        var self = this;

        this.$notesTableContext = this.$notesTable.DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": "/notes/list",
                "type": "GET",
                "data": function (d) {
                    var pageNumber = Math.ceil(d.start / d.length) + 1;
                    return {
                        pageNumber: pageNumber,
                        pageSize: d.length,
                        status: (self.$statusFilter.val() >= 0) ? self.$statusFilter.val() : null,
                        issueDate: self.$issueDateFilter.val(),
                        billingDate: self.$billingDateFilter.val(),
                        paymentDate: self.$paymentDateFilter.val()
                    };
                },
                "dataSrc": function (json) {
                    json.recordsTotal = json.total;
                    json.recordsFiltered = json.total;
                    return json.data;
                }
            },
            "columns": [
                { "data": "payerName" },
                {
                    "data": "issueDate",
                    "render": function (data, type, row) {
                        return data ? new Date(data).toLocaleString('pt-BR') : '';
                    }
                },
                {
                    "data": "billingDate",
                    "render": function (data, type, row) {
                        return data ? new Date(data).toLocaleString('pt-BR') : '';
                    }
                },
                {
                    "data": "paymentDate",
                    "render": function (data, type, row) {
                        return data ? new Date(data).toLocaleString('pt-BR') : '';
                    }
                },
                {
                    "data": "noteValue",
                    "render": function (data, type, row) {
                        return data ? formatCurrency(data) : '';
                    }
                },
                {
                    "data": "status",
                    "render": function (data, type, row) {
                        return getStatusDescription(data);
                    }
                }
            ],
            "language": {
                "url": 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Portuguese.json'
            },
            "pageLength": 10,
            "lengthMenu": [10, 25, 50],
            "paging": true,
            "pagingType": "simple_numbers",
            "searching": false,
            "ordering": false
        });
    },

    bindEvents: function () {
        var self = this;

        this.$issueDateFilter.on('change', function () {
            self.reloadData();
        });

        this.$billingDateFilter.on('change', function () {
            self.reloadData();
        });

        this.$paymentDateFilter.on('change', function () {
            self.reloadData();
        });

        this.$statusFilter.on('change', function () {
            self.reloadData();
        });
    },

    reloadData: function () {
        this.$notesTable.DataTable().ajax.reload();
    }
};

$(document).ready(function () {
    Notas.init();
});