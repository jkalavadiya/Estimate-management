import { EstimateResponse } from '@/types/estimate';

export const fetchEstimateData = async (): Promise<EstimateResponse> => {
	try {
	  const response = await fetch('/data/estimate-detail.json', {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const data: EstimateResponse = await response.json();
	  return data;
	} catch (error) {
	  console.error('Error fetching estimate data:', error);
	  throw error;
	}
  };

// Utility functions for calculations
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export const parsePrice = (priceString: string): number => {
  const numericValue = parseFloat(priceString) || 0;
  return numericValue / 100; // Divide by 100 as per requirements
};

export const formatPriceForStorage = (price: number): string => {
  return Math.round(price * 100).toString(); // Multiply by 100 for storage
};