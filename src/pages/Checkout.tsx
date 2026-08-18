import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import RingViewer from '../components/RingViewer';
import { formatDiamondSummary } from '../utils/formatDiamondSummary';
import { DEFAULT_MODEL_URL, formatPriceEUR, getMaterialPreset } from '../utils/modelVariants';

// ─── Shared data ──────────────────────────────────────────────────────────────

const RING_SIZES = ['44', '46', '47', '48', '50', '52', '54', '56', '58'];

interface FormData {
    ringSize: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
    postalCode: string;
    city: string;
    street: string;
    additional: string;
    sameAsBilling: boolean;
    billingFirstName: string;
    billingLastName: string;
    billingPhone: string;
    billingEmail: string;
    billingCountry: string;
    billingPostalCode: string;
    billingCity: string;
    billingStreet: string;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const STEPS_LABELS = ['Details', 'Summary', 'Confirmation'];
const STEP_SLUGS: Record<1 | 2 | 3, string> = { 1: 'details', 2: 'summary', 3: 'confirmation' };
const SLUG_TO_STEP: Record<string, 1 | 2 | 3> = { details: 1, summary: 2, confirmation: 3 };

function ProgressBar({ currentStep, onStepClick }: { currentStep: number; onStepClick: (step: 1 | 2 | 3) => void }) {
    return (
        <div className="w-full px-6 md:px-[52px] desktop:px-[80px] pt-8 pb-10">
            <div className="flex w-full">
                {STEPS_LABELS.map((label, i) => {
                    const stepNum = (i + 1) as 1 | 2 | 3;
                    const isActiveOrDone = currentStep >= stepNum;
                    const isPast = stepNum < currentStep && currentStep < 3;

                    return (
                        <div
                            key={label}
                            onClick={() => isPast && onStepClick(stepNum)}
                            className={`flex flex-col flex-1 transition-opacity duration-300 ${isActiveOrDone ? 'opacity-100' : 'opacity-30'} ${isPast ? 'cursor-pointer hover:opacity-60' : ''}`}
                        >
                            <span className="justify-center gap-1 flex flex-row font-nata text-[16px] tracking-normal mb-3 text-center">
                                <span className="hidden md:block">Order</span> {label}
                            </span>
                            <div className="flex items-center w-full">
                                <div className="flex-1 h-[2px] bg-[#141414]" />
                                <div className="w-[8px] h-[8px] rounded-full bg-[#141414] shrink-0" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface ConfigState {
    material?: string;
    cut?: string;
    weight?: string;
    setting?: string;
    mounting?: string;
    modelUrl?: string;
    price?: number;
}

function CheckoutRingPreview({ config, className }: { config?: ConfigState; className: string }) {
    return (
        <div className={`bg-white shrink-0 overflow-hidden ${className}`}>
            <RingViewer
                modelUrl={config?.modelUrl || DEFAULT_MODEL_URL}
                materialPreset={getMaterialPreset(config?.material || '18KT White Gold')}
                viewerMode="checkoutCard"
            />
        </div>
    );
}

// ─── Product Card (reused across steps) ──────────────────────────────────────

function ProductCard({ compact = false, config }: { compact?: boolean, config?: ConfigState }) {
    const diamondSummary = formatDiamondSummary(config?.weight || '1.00ct', config?.cut || 'Brilliant Cut');
    const mounting = config?.mounting || 'Classic';

    return (
        <div className="bg-[#F5F5F5] p-5 md:p-6 h-fit">
            <p className="font-nata font-semibold text-[#141414] text-[16px] uppercase tracking-[0.04em] mb-2">
                Diamond Solitaire Ring
            </p>
            <div className="flex gap-2 md:gap-3">
                <CheckoutRingPreview
                    config={config}
                    className={compact ? 'w-[104px] h-[104px]' : 'w-[124px] h-[124px] md:w-[168px] md:h-[168px] desktop:w-[200px] desktop:h-[200px]'}
                />
                <div className="flex flex-col gap-[2px] wrap-anywhere min-w-0">
                    <span className="font-nata text-[#737373] text-[14px]">{config?.material || '18KT White Gold'}</span>
                    <span className="font-nata text-[#737373] text-[14px]">{diamondSummary}</span>
                    <span className="font-nata text-[#737373] text-[14px]">{mounting} Setting</span>
                    <span className="font-nata text-[#737373] text-[14px]">{config?.setting || 'Classic Band'}</span>
                    <span className="font-nata text-[#737373] text-[14px]">Ref: 123123</span>
                    <span className="font-nata font-semibold text-[#141414] text-[16px] mt-1">{formatPriceEUR(config?.price)}</span>
                </div>
            </div>
            <div className="mt-4 pt-4">
                <p className="font-nata text-[#737373] text-[14px] text-center">Will be Shipped for FREE by</p>
                <p className="font-nata font-semibold text-[#141414] text-[16px] uppercase text-center">Tuesday, February 24</p>
            </div>
        </div>
    );
}

// ─── Shared Components ────────────────────────────────────────────────────────

const inputClass =
    'peer w-full border-b bg-transparent pt-6 pb-1 text-[16px] font-nata text-[#141414] placeholder-transparent focus:outline-none transition-colors duration-200';

const FIELD_VALIDATORS: Partial<Record<keyof FormData, (v: string) => string | undefined>> = {
    email:              v => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email address' : undefined,
    billingEmail:       v => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email address' : undefined,
    phone:              v => v && !/^\+?[\d\s\-\(\)]{7,20}$/.test(v) ? 'Invalid phone number' : undefined,
    billingPhone:       v => v && !/^\+?[\d\s\-\(\)]{7,20}$/.test(v) ? 'Invalid phone number' : undefined,
    postalCode:         v => v && !/^[A-Z0-9\s\-]{3,10}$/i.test(v) ? 'Invalid postal code' : undefined,
    billingPostalCode:  v => v && !/^[A-Z0-9\s\-]{3,10}$/i.test(v) ? 'Invalid postal code' : undefined,
};

function LabelledInput({
    label,
    field,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    maxLength,
}: {
    label: string;
    field: keyof FormData;
    type?: string;
    value: string;
    onChange: (field: keyof FormData, val: string) => void;
    onBlur?: (field: keyof FormData) => void;
    error?: string;
    maxLength?: number;
}) {
    const id = `input-${field}`;
    return (
        <div className="relative mt-2">
            <input
                id={id}
                type={type}
                maxLength={maxLength}
                className={`${inputClass} ${error ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-[#C0C0C0] focus:border-[#141414]'}`}
                placeholder={label.replace('*', '')}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                onBlur={() => onBlur?.(field)}
            />
            <label
                htmlFor={id}
                className={`absolute left-0 top-6 font-nata text-[14px] transition-all duration-300 transform -translate-y-6 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 cursor-text ${error ? 'text-red-500' : 'text-[#737373]'}`}
            >
                {label}
            </label>
            {error && (
                <span className="absolute left-0 top-full mt-1 text-[14px] font-nata text-red-500 pointer-events-none">
                    {error}
                </span>
            )}
        </div>
    );
}

// ─── Step 1: Order Details ────────────────────────────────────────────────────

function StepOrderDetails({
    form,
    config,
    onChange,
    onNext,
}: {
    form: FormData;
    config?: ConfigState;
    onChange: (field: keyof FormData, value: string | boolean) => void;
    onNext: () => void;
}) {
    const [sizeOpen, setSizeOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const handleLocalChange = (field: keyof FormData, value: string | boolean) => {
        if (typeof value === 'string') {
            if (field === 'phone' || field === 'billingPhone') {
                value = value.replace(/[^\d\s+\-()]/g, '');
            } else if (field === 'postalCode' || field === 'billingPostalCode') {
                value = value.replace(/[^A-Za-z0-9\s-]/g, '').toUpperCase();
            }
        }
        onChange(field, value);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleBlur = (field: keyof FormData) => {
        const validator = FIELD_VALIDATORS[field];
        if (!validator) return;
        const error = validator(String(form[field] ?? ''));
        if (error) setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleNext = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        const requiredFields: (keyof FormData)[] = ['ringSize', 'firstName', 'lastName', 'phone', 'email', 'country', 'postalCode', 'city', 'street'];

        if (!form.sameAsBilling) {
            requiredFields.push('billingFirstName', 'billingLastName', 'billingPhone', 'billingEmail', 'billingCountry', 'billingPostalCode', 'billingCity', 'billingStreet');
        }

        requiredFields.forEach(field => {
            if (!form[field] || String(form[field]).trim() === '') {
                newErrors[field] = 'Required';
            }
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
        const postalRegex = /^[A-Z0-9\s\-]{3,10}$/i;

        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (form.phone && !phoneRegex.test(form.phone)) {
            newErrors.phone = 'Invalid phone number';
        }
        if (form.postalCode && !postalRegex.test(form.postalCode)) {
            newErrors.postalCode = 'Invalid postal code';
        }

        if (!form.sameAsBilling) {
            if (form.billingEmail && !emailRegex.test(form.billingEmail)) {
                newErrors.billingEmail = 'Invalid email address';
            }
            if (form.billingPhone && !phoneRegex.test(form.billingPhone)) {
                newErrors.billingPhone = 'Invalid phone number';
            }
            if (form.billingPostalCode && !postalRegex.test(form.billingPostalCode)) {
                newErrors.billingPostalCode = 'Invalid postal code';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            onNext();
        }
    };

    return (
        <div className="px-6 md:px-[52px] desktop:px-[80px] pb-16">
            <h1 className="font-orbitron text-[22px] md:text-[32px] font-light text-[#141414] mb-8">Order Details</h1>

            <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_340px] desktop:grid-cols-[1fr_400px] gap-8 md:gap-8 desktop:gap-10">

                {/* ── LEFT: Form ── */}
                <div className="flex flex-col gap-8 p-6  desktop:px-8">

                    {/* Ring Size */}
                    <div className="grid grid-cols-1 desktop:grid-cols-2 gap-x-8 desktop:gap-x-16">
                        <div>
                            <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] text-[#141414] mb-8">Ring Size</p>
                            <div className="relative w-full">
                                <button
                                    onClick={() => setSizeOpen(o => !o)}
                                    className={`relative flex items-center font-semibold justify-center w-full border px-5 py-2.5 font-nata text-[16px] uppercase tracking-[0.08em] hover:bg-[#F5F5F5] transition-colors duration-200 ${errors.ringSize ? 'border-red-500 text-red-500' : 'border-[#141414] text-[#141414]'}`}
                                >
                                    {form.ringSize || 'Choose your size'}
                                    <svg className="absolute right-5" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                        <path d="M1 1L6 6L11 1" stroke={errors.ringSize ? "#EF4444" : "#141414"} strokeWidth="1.5" />
                                    </svg>
                                </button>
                                {/* Error */}
                                {errors.ringSize && (
                                    <span className="absolute left-0 top-full mt-1 text-[14px] font-nata text-red-500 pointer-events-none whitespace-nowrap">
                                        {errors.ringSize}
                                    </span>
                                )}
                                {/* Dropdown */}
                                {sizeOpen && (
                                    <div className="absolute top-full left-0 z-20 w-full bg-white border border-[#141414] mt-px shadow-sm">
                                        {RING_SIZES.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => { handleLocalChange('ringSize', size); setSizeOpen(false); }}
                                                className="block w-full font-semibold text-center px-5 py-2 font-nata text-[16px] text-[#141414] hover:bg-[#F5F5F5] transition-colors"
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Billing */}
                    <div>
                        <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] text-[#141414] mb-5 flex items-center whitespace-nowrap overflow-hidden">
                            Shipping
                            <span className={`transition-all duration-700 ease-in-out origin-left ${form.sameAsBilling ? 'opacity-100 max-w-[200px] ml-1.5' : 'opacity-0 max-w-0 ml-0'}`}>
                                & Billing
                            </span>
                        </p>

                        {/* Fields — 1 col on mobile+tablet, 2 col on desktop */}
                        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-x-8 desktop:gap-x-16 gap-y-5">
                            <LabelledInput label="First name*" field="firstName" value={form.firstName} onChange={handleLocalChange} error={errors.firstName} maxLength={64} />
                            <LabelledInput label="Last name*" field="lastName" value={form.lastName} onChange={handleLocalChange} error={errors.lastName} maxLength={64} />
                            <LabelledInput label="Phone number*" field="phone" type="tel" value={form.phone} onChange={handleLocalChange} onBlur={handleBlur} error={errors.phone} maxLength={32} />
                            <LabelledInput label="Email*" field="email" type="email" value={form.email} onChange={handleLocalChange} onBlur={handleBlur} error={errors.email} maxLength={128} />

                            {/* Country (left) & Postal/City (right) */}
                            <div className="relative mt-2 md:col-span-1">
                                <select
                                    id="input-country"
                                    className={`${inputClass} appearance-none pr-6 cursor-pointer ${errors.country ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-[#C0C0C0] focus:border-[#141414]'}`}
                                    value={form.country}
                                    onChange={(e) => handleLocalChange('country', e.target.value)}
                                >
                                    <option value="" disabled className="hidden"></option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Italy">Italy</option>
                                    <option value="Netherlands">Netherlands</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                </select>
                                <label
                                    htmlFor="input-country"
                                    className={`absolute left-0 top-6 font-nata text-[14px] transition-all duration-300 transform -translate-y-6 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 pointer-events-none ${errors.country ? 'text-red-500' : 'text-[#737373]'}`}
                                >
                                    Country*
                                </label>
                                <svg className="absolute right-1 top-[28px] pointer-events-none" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke={errors.country ? "#EF4444" : "#141414"} strokeWidth="1.5" />
                                </svg>
                                {/* Error Message */}
                                {errors.country && (
                                    <span className="absolute left-0 top-full mt-1 text-[14px] font-nata text-red-500 pointer-events-none">
                                        {errors.country}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                <LabelledInput label="Postal code*" field="postalCode" value={form.postalCode} onChange={handleLocalChange} onBlur={handleBlur} error={errors.postalCode} maxLength={32} />
                                <LabelledInput label="City*" field="city" value={form.city} onChange={handleLocalChange} error={errors.city} maxLength={64} />
                            </div>

                            {/* Street / Additional Info — desktop: row of 2 */}
                            <div className="desktop:col-span-2 grid grid-cols-1 desktop:grid-cols-2 gap-x-8 desktop:gap-x-16 gap-y-5">
                                <LabelledInput label="Street address*" field="street" value={form.street} onChange={handleLocalChange} error={errors.street} maxLength={128} />
                                <LabelledInput label="Additional information" field="additional" value={form.additional} onChange={handleLocalChange} maxLength={128} />
                            </div>
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-center gap-2.5 mt-6 cursor-pointer group">
                            <div
                                onClick={() => handleLocalChange('sameAsBilling', !form.sameAsBilling)}
                                className={`w-6 h-6 border shrink-0 flex items-center justify-center transition-colors duration-200
                                    ${form.sameAsBilling ? 'bg-[#141414] border-[#141414]' : 'bg-white border-[#C0C0C0]'}`}
                            >
                                {form.sameAsBilling && (
                                    <svg width="14" height="12" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="font-nata text-[16px] text-[#141414]">Use same information for billing</span>
                        </label>

                        {/* Animated Billing Section */}
                        <div
                            className={`grid transition-all duration-700 ease-in-out ${!form.sameAsBilling ? 'grid-rows-[1fr] opacity-100 mt-8  border-[#F5F5F5]' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0'}`}
                        >
                            <div className="overflow-hidden">
                                <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] text-[#141414] mb-5">Billing</p>
                                <div className="grid grid-cols-1 desktop:grid-cols-2 gap-x-8 desktop:gap-x-16 gap-y-5">
                                    <LabelledInput label="First name*" field="billingFirstName" value={form.billingFirstName} onChange={handleLocalChange} error={errors.billingFirstName} maxLength={64} />
                                    <LabelledInput label="Last name*" field="billingLastName" value={form.billingLastName} onChange={handleLocalChange} error={errors.billingLastName} maxLength={64} />
                                    <LabelledInput label="Phone number*" field="billingPhone" type="tel" value={form.billingPhone} onChange={handleLocalChange} onBlur={handleBlur} error={errors.billingPhone} maxLength={32} />
                                    <LabelledInput label="Email*" field="billingEmail" type="email" value={form.billingEmail} onChange={handleLocalChange} onBlur={handleBlur} error={errors.billingEmail} maxLength={128} />

                                    {/* Country selection for billing */}
                                    <div className="relative mt-2 md:col-span-1">
                                        <select
                                            id="input-billingCountry"
                                            className={`${inputClass} appearance-none pr-6 cursor-pointer ${errors.billingCountry ? 'border-red-500 focus:border-red-500 text-red-500' : 'border-[#C0C0C0] focus:border-[#141414]'}`}
                                            value={form.billingCountry}
                                            onChange={(e) => handleLocalChange('billingCountry', e.target.value)}
                                        >
                                            <option value="" disabled className="hidden"></option>
                                            <option value="Belgium">Belgium</option>
                                            <option value="France">France</option>
                                            <option value="Germany">Germany</option>
                                            <option value="Italy">Italy</option>
                                            <option value="Netherlands">Netherlands</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="United States">United States</option>
                                        </select>
                                        <label
                                            htmlFor="input-billingCountry"
                                            className={`absolute left-0 top-6 font-nata text-[14px] transition-all duration-300 transform -translate-y-6 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6 pointer-events-none ${errors.billingCountry ? 'text-red-500' : 'text-[#737373]'}`}
                                        >
                                            Country*
                                        </label>
                                        <svg className="absolute right-1 top-[28px] pointer-events-none" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                            <path d="M1 1L6 6L11 1" stroke={errors.billingCountry ? "#EF4444" : "#141414"} strokeWidth="1.5" />
                                        </svg>
                                        {errors.billingCountry && (
                                            <span className="absolute left-0 top-full mt-1 text-[14px] font-nata text-red-500 pointer-events-none">
                                                {errors.billingCountry}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                        <LabelledInput label="Postal code*" field="billingPostalCode" value={form.billingPostalCode} onChange={handleLocalChange} onBlur={handleBlur} error={errors.billingPostalCode} maxLength={32} />
                                        <LabelledInput label="City*" field="billingCity" value={form.billingCity} onChange={handleLocalChange} error={errors.billingCity} maxLength={64} />
                                    </div>

                                    <div className="desktop:col-span-2 grid grid-cols-1 desktop:grid-cols-2 gap-x-8 desktop:gap-x-16 gap-y-5">
                                        <LabelledInput label="Street address*" field="billingStreet" value={form.billingStreet} onChange={handleLocalChange} error={errors.billingStreet} maxLength={128} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA button at the bottom of the form column */}
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={handleNext}
                                className="bg-[#141414] text-white font-nata font-semibold text-[16px] tracking-[0.04em] uppercase px-10 py-4 hover:bg-white hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Product Card ── */}
                <div className="md:sticky md:top-6 h-fit">
                    <ProductCard config={config} />
                </div>
            </div>
        </div>
    );
}

// ─── Step 2: Order Summary ────────────────────────────────────────────────────

function StepOrderSummary({
    form,
    config,
    onEdit,
    onNext,
}: {
    form: FormData;
    config?: ConfigState;
    onEdit: () => void;
    onNext: () => void;
}) {
    return (
        <div className="px-6 md:px-[52px] desktop:px-[80px] pb-16">
            <h1 className="font-orbitron text-[22px] md:text-[32px] font-light text-[#141414] mb-8">Order Summary</h1>

            <div className="flex flex-col md:grid md:grid-cols-[1fr_340px] desktop:grid-cols-[1fr_400px] gap-6 md:gap-8 desktop:gap-10 items-start">

                {/* ── LEFT: Data + Payment ── */}
                <div className="flex flex-col gap-5">

                    {/* Details card */}
                    <div className="bg-[#F5F5F5] p-5 md:p-6 desktop:p-8">
                        {/* Ring Size row */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="font-nata font-semibold text-[16px] uppercase tracking-[0.04em] text-[#141414] mb-2">Ring Size</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.ringSize || '—'}</p>
                            </div>
                            <button
                                onClick={onEdit}
                                className="flex items-center gap-1.5 font-nata text-[14px] font-semibold uppercase tracking-[0.1em] text-[#141414] hover:opacity-60 transition-opacity"
                            >
                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-100">
                                    <path d="M0.707031 12.707C3.90703 9.50703 6.70703 6.70703 6.70703 6.70703C3.50703 3.50703 0.707031 0.707031 0.707031 0.707031" stroke="#141414" strokeWidth="2" />
                                </svg>
                                Edit
                            </button>
                        </div>

                        <div className="my-4" />

                        {/* Shipping */}
                        <p className="font-nata font-semibold text-[16px] uppercase tracking-[0.04em] text-[#141414] mb-2">Shipping</p>
                        <div className="flex flex-col gap-[2px] wrap-anywhere min-w-0">
                            <p className="font-nata text-[14px] text-[#737373]">{form.firstName} {form.lastName}</p>
                            <p className="font-nata text-[14px] text-[#737373]">{form.phone}</p>
                            <p className="font-nata text-[14px] text-[#737373]">{form.email}</p>
                            <p className="font-nata text-[14px] text-[#737373]">{form.country} {form.postalCode} {form.city}</p>
                            <p className="font-nata text-[14px] text-[#737373]">{form.street}</p>
                            <p className="font-nata text-[14px] text-[#737373]">{form.additional ? `  ${form.additional}` : ''}</p>
                        </div>

                        <div className="my-6" />

                        {/* Billing */}
                        <p className="font-nata font-semibold text-[16px] uppercase tracking-[0.04em] text-[#141414] mb-2">Billing</p>
                        {form.sameAsBilling ? (
                            <p className="font-nata text-[14px] text-[#737373]">Same as shipping address</p>
                        ) : (
                            <div className="flex flex-col gap-[2px] wrap-anywhere min-w-0">
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingFirstName} {form.billingLastName}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingPhone}{'  '}{form.billingEmail}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingCountry} {form.billingPostalCode} {form.billingCity}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingStreet}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Method card */}
                    <div className="bg-[#F5F5F5] p-5 md:p-6 desktop:p-8">
                        <p className="font-nata font-semibold text-[16px] uppercase tracking-[0.04em] text-[#141414] mb-5">Payment Method</p>
                        <button
                            onClick={onNext}
                            className="flex items-center desktop:mx-auto justify-center gap-2 bg-[#141414] text-white font-nata font-semibold text-[16px] tracking-[0.04em] px-8 py-3.5 hover:bg-white hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300"
                        >
                            PAY WITH
                            <span className="font-bold tracking-normal">Revolut</span>
                            <span className="font-light tracking-normal">Pay</span>
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Product Card ── */}
                <div className="md:sticky md:top-6 h-fit">
                    <ProductCard config={config} />
                </div>
            </div>
        </div>
    );
}

// ─── Step 3: Order Confirmation ───────────────────────────────────────────────

function StepOrderConfirmation({ form, config, onExit }: { form: FormData, config?: ConfigState, onExit: (e: React.MouseEvent) => void }) {
    const mounting = config?.mounting || 'Classic';

    return (
        <div className="px-6 md:px-[52px] desktop:px-[80px] pb-16">

            {/* Thank you text */}
            <div className="mb-8">
                <h1 className="font-orbitron text-[22px] md:text-[32px] text-[#141414] mb-4 leading-tight">
                    Thank You for Your Purchase
                </h1>
                <p className="font-nata font-semibold text-[16px] text-[#141414] mb-2">ORDER #123123</p>
                <p className="font-nata text-[16px] text-[#737373] mb-2">Your payment has been successfully processed.</p>
                <p className="font-nata text-[16px] text-[#737373] mb-2">A confirmation email with your order details has been sent to you.</p>
                <p className="font-nata text-[16px] text-[#737373] mb-2">Your Creation will be Shipped for FREE by Tuesday, February 24.</p>
                <p className="font-nata text-[16px] text-[#141414] mt-3">
                    For any questions, please contact us at:{' '}
                    <a href="mailto:info@e-mail.com" className="underline hover:opacity-60 transition-opacity">
                        info@e-mail.com
                    </a>
                </p>
            </div>

            {/* ── Mobile / Tablet layout ── */}
            {/* Mobile: all stacked */}
            {/* Tablet md: top text → product card (full) → 2-col grid (shipping / billing) */}
            <div className="desktop:hidden flex flex-col gap-5">
                {/* Product card — full width on tablet */}
                <div className="bg-[#F5F5F5] p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-3">
                    <CheckoutRingPreview
                        config={config}
                        className="w-full aspect-square min-h-[260px] md:min-h-0"
                    />
                    <div>
                        <p className="font-nata font-semibold text-[16px] uppercase tracking-widest mb-2 text-[#141414]">Diamond Solitaire Ring</p>
                        <p className="font-nata text-[14px] text-[#737373]">{config?.material || '18KT White Gold'}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{formatDiamondSummary(config?.weight || '1.00ct', config?.cut || 'Brilliant Cut')}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{mounting} Setting</p>
                        <p className="font-nata text-[14px] text-[#737373]">{config?.setting || 'Classic Band'}</p>
                        <p className="font-nata text-[14px] text-[#737373]">Ref: 123123</p>
                        <p className="font-nata font-semibold text-[16px] mt-2 text-[#141414]">{formatPriceEUR(config?.price)}</p>
                    </div>
                </div>

                {/* 2-col grid below card (tablet+), stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Ring size + Shipping */}
                    <div className="bg-[#F5F5F5] p-5 wrap-anywhere overflow-hidden">
                        <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] mb-2 text-[#141414]">Ring Size</p>
                        <p className="font-nata text-[14px] text-[#737373] mb-4">{form.ringSize || '—'}</p>
                        <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] mb-2 text-[#141414]">Shipping</p>
                        <p className="font-nata text-[14px] text-[#737373]">{form.firstName} {form.lastName}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{form.phone}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{form.email}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{form.country} {form.postalCode} {form.city}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{form.street}</p>
                        {form.additional && <p className="font-nata text-[14px] text-[#737373]">{form.additional}</p>}
                    </div>
                    {/* Billing */}
                    <div className="bg-[#F5F5F5] p-5 wrap-anywhere overflow-hidden">
                        <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] mb-2 text-[#141414]">Billing</p>
                        {form.sameAsBilling ? (
                            <p className="font-nata text-[14px] text-[#737373]">Same as shipping address</p>
                        ) : (
                            <div className="flex flex-col gap-[2px] wrap-anywhere min-w-0">
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingFirstName} {form.billingLastName}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingPhone}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingEmail}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingCountry} {form.billingPostalCode} {form.billingCity}</p>
                                <p className="font-nata text-[14px] text-[#737373]">{form.billingStreet}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Desktop: 3-column grid ── */}
            <div className="hidden desktop:grid desktop:grid-cols-4 gap-5">
                {/* Col 1: Product card with image */}
                <div className="desktop:col-span-2 bg-[#F5F5F5] p-8 flex flex-row gap-4">
                    <CheckoutRingPreview config={config} className="w-[320px] h-[320px]" />
                    <div className="flex flex-col">
                        <p className="font-nata font-semibold text-[16px] uppercase tracking-widest mb-2 text-[#141414]">Diamond Solitaire Ring</p>
                        <p className="font-nata text-[14px] text-[#737373]">{config?.material || '18KT White Gold'}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{formatDiamondSummary(config?.weight || '1.00ct', config?.cut || 'Brilliant Cut')}</p>
                        <p className="font-nata text-[14px] text-[#737373]">{mounting} Setting</p>
                        <p className="font-nata text-[14px] text-[#737373]">{config?.setting || 'Classic Band'}</p>
                        <p className="font-nata text-[14px] text-[#737373]">Ref: 123123</p>
                        <p className="font-nata font-semibold text-[16px] mt-2 text-[#141414]">{formatPriceEUR(config?.price)}</p>
                    </div>
                </div>

                {/* Col 2: Ring size + Shipping */}
                <div className="desktop:col-span-1 bg-[#F5F5F5] p-8 wrap-anywhere overflow-hidden">
                    <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] mb-2 text-[#141414]">Ring Size</p>
                    <p className="font-nata text-[16px] text-[#737373] mb-5">{form.ringSize || '—'}</p>
                    <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] mb-2 text-[#141414]">Shipping</p>
                    <p className="font-nata text-[16px] text-[#737373]">{form.firstName} {form.lastName}</p>
                    <p className="font-nata text-[16px] text-[#737373]">{form.phone}</p>
                    <p className="font-nata text-[16px] text-[#737373]">{form.email}</p>
                    <p className="font-nata text-[16px] text-[#737373]">{form.country} {form.postalCode} {form.city}</p>
                    <p className="font-nata text-[16px] text-[#737373]">{form.street}</p>
                    {form.additional && <p className="font-nata text-[16px] text-[#737373]">{form.additional}</p>}
                </div>

                {/* Col 3: Billing */}
                <div className="desktop:col-span-1 bg-[#F5F5F5] p-8 wrap-anywhere overflow-hidden">
                    <p className="font-nata font-semibold text-[14px] uppercase tracking-[0.12em] mb-2 text-[#141414]">Billing</p>
                    {form.sameAsBilling ? (
                        <p className="font-nata text-[16px] text-[#737373]">Same as shipping address</p>
                    ) : (
                        <div className="flex flex-col gap-[2px] wrap-anywhere min-w-0">
                            <p className="font-nata text-[16px] text-[#737373]">{form.billingFirstName} {form.billingLastName}</p>
                            <p className="font-nata text-[16px] text-[#737373]">{form.billingPhone}</p>
                            <p className="font-nata text-[16px] text-[#737373]">{form.billingEmail}</p>
                            <p className="font-nata text-[16px] text-[#737373]">{form.billingCountry} {form.billingPostalCode} {form.billingCity}</p>
                            <p className="font-nata text-[16px] text-[#737373]">{form.billingStreet}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-10">
                <a
                    href="/"
                    onClick={onExit}
                    className="bg-[#141414] text-white font-nata font-semibold text-[16px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-white hover:text-[#141414] hover:outline hover:outline-1 hover:outline-[#141414] transition-all duration-300"
                >
                    Back to Home Screen
                </a>
            </div>
        </div>
    );
}

// ─── Main Checkout ────────────────────────────────────────────────────────────

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Capture config once on mount — location.state is lost after setSearchParams navigations
    const [config] = useState<ConfigState | undefined>(location.state as ConfigState | undefined);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentStep: 1 | 2 | 3 = SLUG_TO_STEP[searchParams.get('step') ?? ''] ?? 1;

    const [renderedStep, setRenderedStep] = useState<1 | 2 | 3>(currentStep);
    const [isFading, setIsFading] = useState(false);
    const [isAppearing, setIsAppearing] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Initial mount animation & Global exit listener
    useEffect(() => {
        // Trigger the entrance animation on the next paint
        const timer = setTimeout(() => setIsAppearing(true), 50);

        // Listen for the header triggering a page exit
        const handleGlobalExit = () => setIsExiting(true);
        document.addEventListener('trigger-page-exit', handleGlobalExit);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('trigger-page-exit', handleGlobalExit);
        };
    }, []);

    const [form, setForm] = useState<FormData>({
        ringSize: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        country: 'Belgium',
        postalCode: '',
        city: '',
        street: '',
        additional: '',
        sameAsBilling: true,
        billingFirstName: '',
        billingLastName: '',
        billingPhone: '',
        billingEmail: '',
        billingCountry: 'Belgium',
        billingPostalCode: '',
        billingCity: '',
        billingStreet: '',
    });

    const handleChange = (field: keyof FormData, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (currentStep === renderedStep) return;
        setIsFading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const timer = setTimeout(() => {
            setRenderedStep(currentStep);
            setIsFading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [currentStep]);

    const handleStepChange = (newStep: 1 | 2 | 3) => {
        if (newStep === currentStep) return;
        setSearchParams({ step: STEP_SLUGS[newStep] }, { replace: newStep === 3 });
    };

    const handleExit = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExiting(true);
        setTimeout(() => {
            navigate('/');
        }, 200);
    };

    return (
        <div className="min-h-[calc(100vh-73px)] md:min-h-[calc(100vh-112px)] bg-white overflow-x-hidden w-full">
            <div
                className={`desktop:max-w-[1440px] desktop:mx-auto transition-transform duration-500 ease-out ${isExiting ? 'translate-x-[100vw]' : isAppearing ? 'translate-x-0' : 'translate-x-[100vw]'}`}
            >
                <ProgressBar currentStep={currentStep} onStepClick={handleStepChange} />

                <div className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    {renderedStep === 1 && (
                        <StepOrderDetails
                            form={form}
                            config={config}
                            onChange={handleChange}
                            onNext={() => handleStepChange(2)}
                        />
                    )}

                    {renderedStep === 2 && (
                        <StepOrderSummary
                            form={form}
                            config={config}
                            onEdit={() => handleStepChange(1)}
                            onNext={() => handleStepChange(3)}
                        />
                    )}

                    {renderedStep === 3 && (
                        <StepOrderConfirmation form={form} config={config} onExit={handleExit} />
                    )}
                </div>
            </div>
        </div>
    );
}
