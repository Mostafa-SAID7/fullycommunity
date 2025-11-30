using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Services.Registration;

public class RegistrationDocument : BaseEntity
{
    public Guid RequestId { get; set; }
    public RegistrationRequest Request { get; set; } = null!;
    
    public DocumentType Type { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public string? FileUrl { get; set; }
    public string? FileName { get; set; }
    public long? FileSizeBytes { get; set; }
    public string? MimeType { get; set; }
    
    public bool IsRequired { get; set; } = true;
    public bool IsUploaded { get; set; }
    public bool IsVerified { get; set; }
    public string? VerificationNotes { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
}

public enum DocumentType 
{ 
    OwnerID, 
    ProofOfAddress, 
    VehicleTitle, 
    PreviousRegistration, 
    InsuranceCertificate, 
    EmissionCertificate, 
    SafetyInspection, 
    SaleInvoice, 
    ImportDocument, 
    PowerOfAttorney, 
    Other 
}
