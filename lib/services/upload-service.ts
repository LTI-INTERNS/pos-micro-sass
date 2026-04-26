import { apiClient } from '@/lib/api-client';

export type UploadFolder = 'products' | 'cashiers' | 'companies' | 'pos';

export interface UploadResult {
    url:      string;
    publicId: string;
}

interface BackendResponse<T> {
    success: boolean;
    data:    T;
}

export const UPLOAD_CONSTRAINTS = {
    maxSizeBytes:   5 * 1024 * 1024,
    maxSizeMB:      5,
    acceptedMimes:  ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    acceptedExts:   '.jpg,.jpeg,.png,.webp,.gif,.svg',
} as const;

// ── Validation helper ────────────────────────────────────────────────────────
export interface ValidationError {
    code:    'FILE_TOO_LARGE' | 'INVALID_TYPE';
    message: string;
}

export function validateImageFile(file: File): ValidationError | null {
    if (!UPLOAD_CONSTRAINTS.acceptedMimes.includes(file.type as (typeof UPLOAD_CONSTRAINTS.acceptedMimes)[number])) {
        return {
            code:    'INVALID_TYPE',
            message: `Unsupported file type "${file.type}". Please use JPEG, PNG, WebP, GIF, or SVG.`,
        };
    }

    if (file.size > UPLOAD_CONSTRAINTS.maxSizeBytes) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(1);
        return {
            code:    'FILE_TOO_LARGE',
            message: `File is ${sizeMB} MB — maximum allowed size is ${UPLOAD_CONSTRAINTS.maxSizeMB} MB.`,
        };
    }

    return null;
}

export interface UploadOptions {
    onProgress?: (pct: number) => void;
    signal?: AbortSignal;
}

export const uploadService = {
    /**
     * Validate then upload a single image file to the given folder.
     * Throws with a user-facing message on validation failure or network error.
     *
     * @param file   - The File object to upload
     * @param folder - Cloudinary sub-folder to place the image in
     * @param opts   - Optional progress callback and abort signal
     */
    upload: async (
        file:   File,
        folder: UploadFolder = 'products',
        opts:   UploadOptions = {},
    ): Promise<UploadResult> => {
        const validationError = validateImageFile(file);
        if (validationError) {
            throw new Error(validationError.message);
        }

        const form = new FormData();
        form.append('image', file);
        form.append('folder', folder);

        const res = await apiClient.post<BackendResponse<UploadResult>>('/upload', form, {
            signal: opts.signal,
            onUploadProgress: opts.onProgress
                ? (e) => {
                      if (e.total && e.total > 0) {
                          opts.onProgress!(Math.round((e.loaded * 100) / e.total));
                      }
                  }
                : undefined,
        });

        return res.data.data;
    },

    createPreview: (
        file:     File,
        onError?: (msg: string) => void,
    ): string | null => {
        const err = validateImageFile(file);
        if (err) {
            onError?.(err.message);
            return null;
        }
        return URL.createObjectURL(file);
    },

    revokePreview: (url: string | null): void => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    },
};