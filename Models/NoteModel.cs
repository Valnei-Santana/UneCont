using System;

namespace UneCont.Models
{
    public class NoteModel
    {
        public int Id { get; set; }

        public string PayerName { get; set; }

        public string NoteIdentificationNumber { get; set; }

        public DateTime IssueDate { get; set; }

        public DateTime? BillingDate { get; set; }

        public DateTime? PaymentDate { get; set; }

        public decimal NoteValue { get; set; }

        public string InvoiceDocument { get; set; }

        public string BankSlipDocument { get; set; }

        public NoteStatus Status { get; set; }
    }

    public enum NoteStatus
    {
        Issued,
        BillingCompleted,
        PaymentOverdue,
        PaymentCompleted
    }
}