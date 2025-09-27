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

    useEffect(() => {
        setLocalSections(sections);
    }, [sections]);

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
                            updatedItem.unit_cost = cost.toString(); // keep raw string
                        }

                        const quantity = parseFloat(updatedItem.quantity) || 0;
                        const unitCost = parseFloat(updatedItem.unit_cost) || 0;
                        const newTotal = quantity * unitCost;
                        updatedItem.total = formatPriceForStorage(newTotal);

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
                    <CardHeader className='bg-estimate-section border-b border-estimate-section-border'>
                        <div className='flex justify-between items-center'>
                            <CardTitle className='text-lg font-semibold'>
                                Section {section.custom_section_id}:{' '}
                                {section.section_name}
                            </CardTitle>
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
                    <CardContent className='p-0'>
                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-15'>
                                            Item #
                                        </TableHead>
                                        <TableHead className='min-w-[300px]'>
                                            Description
                                        </TableHead>
                                        <TableHead className='w-20'>
                                            Type
                                        </TableHead>
                                        <TableHead className='w-24'>
                                            Unit
                                        </TableHead>
                                        <TableHead className='w-32'>
                                            Quantity
                                        </TableHead>
                                        <TableHead className='w-32'>
                                            Unit Cost
                                        </TableHead>
                                        <TableHead className='w-32'>
                                            Total
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {section.items.map((item) => (
                                        <TableRow
                                            key={item.item_id}
                                            className='hover:bg-estimate-item-hover transition-colors duration-150'>
                                            <TableCell className='font-medium '>
                                                {item.estimate_item_no}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className='font-medium'>
                                                        {item.subject}
                                                    </p>
                                                    {item.description && (
                                                        <p className='text-sm text-muted-foreground mt-1'>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
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
                                            <TableCell className='font-medium'>
                                                {item.unit}
                                            </TableCell>
                                            <TableCell>
                                                <EditableCell
                                                    value={item.quantity || '0'}
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
                                                    value={item.unit_cost} // pass raw value from state, not formatted
                                                    onChange={(value) => {
                                                        // store raw string so user can type freely
                                                        handleItemChange(
                                                            section.section_id,
                                                            item.item_id,
                                                            'unit_cost',
                                                            value
                                                        );
                                                    }}
                                                    type='number'
                                                    placeholder='0.00'
                                                    className='w-full'
                                                />
                                            </TableCell>
                                            <TableCell className='font-semibold'>
                                                {formatCurrency(
                                                    parsePrice(item.total)
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default EstimateTable;
