import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, parsePrice } from '@/services/estimateService';
import { EstimateData } from '@/types/estimate';

interface EstimateHeaderProps {
  estimateData: EstimateData;
  grandTotal: number;
}

const EstimateHeader: React.FC<EstimateHeaderProps> = ({ estimateData, grandTotal }) => {
  return (
    <Card className="mb-6 bg-estimate-header text-estimate-header-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Estimate #{estimateData.company_estimate_id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-sm opacity-90">Project Title</h3>
            <p className="text-lg">{estimateData.title}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm opacity-90">Date</h3>
            <p className="text-lg">{estimateData.estimate_date}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm opacity-90">Company</h3>
            <p className="text-lg">{estimateData.user_company_name}</p>
          </div>
        </div>
        <div className="border-t border-estimate-header-foreground/20 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Grand Total</h2>
            <div className="text-right">
              <p className="text-3xl font-bold bg-estimate-total text-estimate-total-foreground px-4 py-2 rounded-lg">
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateHeader;