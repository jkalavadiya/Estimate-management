import { useNavigate } from 'react-router-dom';
import { FileText, Calculator, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const Index = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-background'>
            <div className='container mx-auto px-4 py-16'>
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-bold mb-5 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                        Estimate Management System
                    </h1>
                    <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                        Professional estimate management with real-time
                        calculations, inline editing, and comprehensive project
                        tracking.
                    </p>
                    <div>
                        <Button
                            onClick={() => navigate('/estimate')}
                            className='mt-10'
                            size='lg'>
                            Open Estimate Module
                        </Button>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
                    <Card className='hover:shadow-lg transition-shadow duration-300'>
                        <CardHeader className='text-center'>
                            <FileText className='h-12 w-12 mx-auto mb-4 text-primary' />
                            <CardTitle>View Estimates</CardTitle>
                            <CardDescription>
                                Browse and manage your project estimates with
                                detailed section breakdowns
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className='hover:shadow-lg transition-shadow duration-300'>
                        <CardHeader className='text-center'>
                            <Edit className='h-12 w-12 mx-auto mb-4 text-primary' />
                            <CardTitle>Inline Editing</CardTitle>
                            <CardDescription>
                                Edit quantities and unit costs directly in the
                                table with real-time updates
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className='hover:shadow-lg transition-shadow duration-300'>
                        <CardHeader className='text-center'>
                            <Calculator className='h-12 w-12 mx-auto mb-4 text-primary' />
                            <CardTitle>Real-time Calculations</CardTitle>
                            <CardDescription>
                                Automatic calculation of section totals and
                                grand totals as you type
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <div className='mt-16 text-center'>
                    <Card className='bg-estimate-header text-estimate-header-foreground max-w-2xl mx-auto'>
                        <CardContent className='pt-6'>
                            <h2 className='text-2xl font-bold mb-4'>
                                Ready to Get Started?
                            </h2>
                            <p className='mb-6 opacity-90'>
                                Experience professional estimate management with
                                our comprehensive module featuring sections,
                                items, and real-time calculations.
                            </p>
                            <Button
                                onClick={() => navigate('/estimate')}
                                variant='secondary'
                                size='lg'
                                className='bg-estimate-header-foreground text-estimate-header hover:bg-estimate-header-foreground/90'>
                                Estimate Module
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Index;
