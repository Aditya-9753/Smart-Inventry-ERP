from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum


class ReportType(str, Enum):
    """Supported report types"""
    SALES = "sales"
    INVENTORY = "inventory"
    WAREHOUSE = "warehouse"
    USERS = "users"
    TRANSACTIONS = "transactions"
    LOW_STOCK = "low_stock"
    ANALYTICS = "analytics"


class ExportFormat(str, Enum):
    """Supported export formats"""
    PDF = "pdf"
    EXCEL = "excel"
    CSV = "csv"
    JSON = "json"


class ReportRequest(BaseModel):
    """Request schema for generating reports"""
    report_type: ReportType
    format: ExportFormat = ExportFormat.PDF
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    warehouse_id: Optional[str] = None
    filters: Optional[dict] = Field(default_factory=dict, description="Additional filters")
    
    class Config:
        use_enum_values = True


class ReportMetadata(BaseModel):
    """Metadata about a generated report"""
    report_id: str
    report_type: str
    format: str
    generated_at: datetime
    generated_by: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ReportResponse(BaseModel):
    """Response schema for report generation"""
    filename: str = Field(description="Generated filename")
    download_url: str = Field(description="URL to download the report")
    generated_at: datetime
    metadata: ReportMetadata


class ReportListItem(BaseModel):
    """Item in list of available reports"""
    report_id: str
    filename: str
    report_type: str
    format: str
    generated_at: datetime
    file_size_kb: Optional[float] = None


class ReportListResponse(BaseModel):
    """Response for listing available reports"""
    total: int
    reports: List[ReportListItem]


class SalesReportData(BaseModel):
    """Data structure for sales report"""
    total_revenue: float
    total_items_sold: int
    average_order_value: float
    top_products: List[dict]
    daily_breakdown: List[dict]


class InventoryReportData(BaseModel):
    """Data structure for inventory report"""
    total_products: int
    low_stock_count: int
    total_quantity: int
    warehouse_distribution: List[dict]
    category_breakdown: List[dict]


class TransactionReportData(BaseModel):
    """Data structure for transaction report"""
    total_transactions: int
    inward_transactions: int
    outward_transactions: int
    transfer_transactions: int
    transactions: List[dict]


class UserActivityReportData(BaseModel):
    """Data structure for user activity report"""
    total_users: int
    active_users: int
    user_activity: List[dict]


class ErrorResponse(BaseModel):
    """Error response for report generation"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
