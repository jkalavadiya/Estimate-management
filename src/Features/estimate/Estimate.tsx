import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { fetchEstimateData, parsePrice } from '@/services/estimateService';
import { EstimateResponse, EstimateSection } from '@/types/estimate';
import EstimateHeader from './EstimateHeader';
import EstimateTable from './EstimateTable';

const Estimate: React.FC = () => {
    const [sections, setSections] = useState<EstimateSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [estimateData, setEstimateData] = useState<EstimateResponse | null>(
        null
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchEstimateData();
                setEstimateData(data);
                if (data?.data?.sections) {
                    setSections(data.data.sections);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Calculate grand total from current sections state
    const grandTotal = useMemo(() => {
        return sections.reduce((total, section) => {
            const sectionTotal = section.items.reduce((sectionSum, item) => {
                return sectionSum + parsePrice(item.total);
            }, 0);
            return total + sectionTotal;
        }, 0);
    }, [sections]);

    const handleDataChange = (updatedSections: EstimateSection[]) => {
        setSections(updatedSections);
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
                    <p className='text-muted-foreground'>
                        Loading estimate data...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='container mx-auto px-4 py-8'>
                Error loading estimate data. Please try again later.
            </div>
        );
    }

    if (!estimateData?.data) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <div className='text-center'>No estimate data available.</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className='container mx-auto px-4 py-8 max-w-7xl'>
                <EstimateHeader
                    estimateData={estimateData.data}
                    grandTotal={grandTotal}
                />

                <EstimateTable
                    sections={sections}
                    onDataChange={handleDataChange}
                />

                {sections.length === 0 && (
                    <div className='mt-6'>
                        <AlertCircle className='h-4 w-4' />
                        No sections found in this estimate.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Estimate;
