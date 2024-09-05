using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UneCont.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PayerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NoteIdentificationNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IssueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BillingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NoteValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InvoiceDocument = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BankSlipDocument = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notes");
        }
    }
}
