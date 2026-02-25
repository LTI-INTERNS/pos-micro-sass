import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    price: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Invalid price'),
    discount: z.string().refine(v => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, 'Invalid discount'),
    tax: z.string().refine(v => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, 'Invalid tax'),
    stock: z.string().refine(v => !isNaN(Number(v)) && Number(v) >= 0 && Number.isInteger(Number(v)), 'Invalid stock'),
    soldBy: z.enum(['each', 'volume_weight']),
    unit: z.string().optional(),
}).refine(data => data.soldBy !== 'volume_weight' || (data.unit && data.unit.length > 0), {
    message: 'Unit is required',
    path: ['unit'],
});
