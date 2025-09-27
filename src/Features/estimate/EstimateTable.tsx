import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    formatCurrency,
    parsePrice,
    formatPriceForStorage,
} from '@/services/estimateService';
import { EstimateSection } from '@/types/estimate';
import EditableCell from './EditableCell';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';

interface EstimateTableProps {
    sections: EstimateSection[];
    onDataChange: (updatedSections: EstimateSection[]) => void;
}

const EstimateTable: React.FC<EstimateTableProps> = ({
    sections,
    onDataChange,
}) => {
    const [localSections, setLocalSections] =
        useState<EstimateSection[]>(sections);

    // Track which sections are expanded
    const [expandedSections, setExpandedSections] = useState<
        Record<string, boolean>
    >({});

    // Modal state
    const [modalData, setModalData] = useState<EstimateSection | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [itemModalData, setItemModalData] = useState<any | null>(null); // For individual item
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    useEffect(() => {
        setLocalSections(sections);
        const initialExpanded: Record<string, boolean> = {};
        sections.forEach((section) => {
            initialExpanded[section.section_id] = true;
        });
        setExpandedSections(initialExpanded);
    }, [sections]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const openSectionModal = (section: EstimateSection) => {
        setModalData(section);
        setIsSectionModalOpen(true);
    };

    const closeSectionModal = () => {
        setModalData(null);
        setIsSectionModalOpen(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openItemModal = (item: any) => {
        setItemModalData(item);
        setIsItemModalOpen(true);
    };

    const closeItemModal = () => {
        setItemModalData(null);
        setIsItemModalOpen(false);
    };

    const handleItemChange = (
        sectionId: string,
        itemId: string,
        field: 'quantity' | 'unit_cost',
        value: string
    ) => {
        const updatedSections = localSections.map((section) => {
            if (section.section_id === sectionId) {
                const updatedItems = section.items.map((item) => {
                    if (item.item_id === itemId) {
                        const updatedItem = { ...item };
                        if (field === 'quantity') {
                            let quantity = parseFloat(value) || 0;
                            if (quantity < 0) quantity = 0;
                            updatedItem.quantity = quantity.toString();
                        }
                        if (field === 'unit_cost') {
                            let cost = parseFloat(value) || 0;
                            if (cost < 0) cost = 0;
                            updatedItem.unit_cost = cost.toString();
                        }
                        const quantity = parseFloat(updatedItem.quantity) || 0;
                        const unitCost = parseFloat(updatedItem.unit_cost) || 0;
                        updatedItem.total = formatPriceForStorage(
                            quantity * unitCost
                        );
                        return updatedItem;
                    }
                    return item;
                });

                const sectionTotal = updatedItems.reduce(
                    (sum, i) => sum + parsePrice(i.total),
                    0
                );

                return {
                    ...section,
                    items: updatedItems,
                    section_total: formatPriceForStorage(sectionTotal),
                    section_total_with_optional_item:
                        formatPriceForStorage(sectionTotal),
                };
            }
            return section;
        });

        setLocalSections(updatedSections);
        onDataChange(updatedSections);
    };

    const sectionTotals = useMemo(() => {
        return localSections.reduce((acc, section) => {
            acc[section.section_id] = section.items.reduce((sum, item) => {
                return sum + parsePrice(item.total);
            }, 0);
            return acc;
        }, {} as Record<string, number>);
    }, [localSections]);

    return (
        <div className='space-y-6'>
            {localSections.map((section) => (
                <Card key={section.section_id} className='overflow-hidden'>
                    <CardHeader
                        className='bg-estimate-section border-b border-estimate-section-border cursor-pointer'
                        onClick={() => toggleSection(section.section_id)}>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                {expandedSections[section.section_id] ? (
                                    <ChevronDown className='w-4 h-4' />
                                ) : (
                                    <ChevronRight className='w-4 h-4' />
                                )}
                                <CardTitle className='text-lg font-semibold'>
                                    {section.section_name}
                                </CardTitle>

                                {/* View Section Icon */}
                                <Eye
                                    className='w-5 h-5 cursor-pointer text-blue-500 ml-2'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openSectionModal(section);
                                    }}
                                />
                            </div>
                            <div className='text-right'>
                                <Badge
                                    variant='secondary'
                                    className='text-sm font-medium'>
                                    Section Total:{' '}
                                    {formatCurrency(
                                        sectionTotals[section.section_id] || 0
                                    )}
                                </Badge>
                            </div>
                        </div>
                        {section.description && (
                            <p className='text-sm text-muted-foreground mt-2'>
                                {section.description}
                            </p>
                        )}
                    </CardHeader>

                    {expandedSections[section.section_id] && (
                        <CardContent className='p-0'>
                            <div className='overflow-x-auto'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item #</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit Cost</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {section.items.map((item) => (
                                            <TableRow
                                                key={item.item_id}
                                                className='hover:bg-estimate-item-hover transition-colors duration-150'>
                                                <TableCell>
                                                    {item.estimate_item_no}
                                                </TableCell>
                                                <TableCell>
                                                    {item.subject}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant='outline'
                                                        className='text-xs'>
                                                        {
                                                            item.item_type_display_name
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {item.unit}
                                                </TableCell>
                                                <TableCell>
                                                    <EditableCell
                                                        value={
                                                            item.quantity || '0'
                                                        }
                                                        onChange={(value) =>
                                                            handleItemChange(
                                                                section.section_id,
                                                                item.item_id,
                                                                'quantity',
                                                                value
                                                            )
                                                        }
                                                        type='number'
                                                        placeholder='0'
                                                        className='w-full'
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <EditableCell
                                                        value={item.unit_cost}
                                                        onChange={(value) =>
                                                            handleItemChange(
                                                                section.section_id,
                                                                item.item_id,
                                                                'unit_cost',
                                                                value
                                                            )
                                                        }
                                                        type='number'
                                                        placeholder='0.00'
                                                        className='w-full'
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(
                                                        parsePrice(item.total)
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Eye
                                                        className='w-5 h-5 cursor-pointer text-green-500'
                                                        onClick={() =>
                                                            openItemModal(item)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}

            {/* Section Modal */}
            {isSectionModalOpen && modalData && (
                <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
                    <div className='bg-white p-6 rounded-lg w-1/1 max-h-[80vh] overflow-y-auto'>
                        <h2 className='text-xl font-semibold mb-4'>
                            {modalData.section_name}
                        </h2>
                        {modalData.description && (
                            <p className='mb-4 text-sm text-muted-foreground'>
                                {modalData.description}
                            </p>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item #</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit Cost</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modalData.items.map((item) => (
                                    <TableRow key={item.item_id}>
                                        <TableCell>
                                            {item.estimate_item_no}
                                        </TableCell>
                                        <TableCell>{item.subject}</TableCell>
                                        <TableCell>
                                            {item.item_type_display_name}
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.unit_cost}</TableCell>
                                        <TableCell>
                                            {formatCurrency(
                                                parsePrice(item.total)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className='mt-4 text-right'>
                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded'
                                onClick={closeSectionModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Item Modal */}
            {isItemModalOpen && itemModalData && (
                <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
                    <div className='bg-white p-6 rounded-lg w-1/3 max-h-[60vh] overflow-y-auto'>
                        <h2 className='text-xl font-semibold mb-4'>
                            {itemModalData.subject}
                        </h2>
                        {itemModalData.description && (
                            <p className='mb-4 text-sm text-muted-foreground'>
                                {itemModalData.description}
                            </p>
                        )}
                        <div className='text-sm'>
                            <p>
                                <strong>Item #: </strong>
                                {itemModalData.estimate_item_no}
                            </p>
                            <p>
                                <strong>Type: </strong>
                                {itemModalData.item_type_display_name}
                            </p>
                            <p>
                                <strong>Unit: </strong>
                                {itemModalData.unit}
                            </p>
                            <p>
                                <strong>Quantity: </strong>
                                {itemModalData.quantity}
                            </p>
                            <p>
                                <strong>Unit Cost: </strong>
                                {itemModalData.unit_cost}
                            </p>
                            <p>
                                <strong>Total: </strong>
                                {formatCurrency(
                                    parsePrice(itemModalData.total)
                                )}
                            </p>
                        </div>
                        <div className='mt-4 text-right'>
                            <button
                                className='px-4 py-2 bg-blue-500 text-white rounded'
                                onClick={closeItemModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstimateTable;
