import { useEffect, useState, Suspense, lazy } from 'react';
import { sanityClient } from '../sanityClient';
import CaratsLoader from '../components/CaratsLoader';
import { getMaterialPreset, resolveModelVariantUrl, type ModelVariant } from '../utils/modelVariants';
import './ProductPage.css';

const RingViewer = lazy(() => import('../components/RingViewer'));

interface Product {
    modelVariants?: ModelVariant[];
}

// Copy lives in code — the product schema only carries 3D model variants.
const PRODUCT_TITLE = 'Elegant Diamond Ring';
const PRODUCT_DESCRIPTION =
    'A breathtakingly beautiful diamond ring featuring a stunning center stone, perfect for any special occasion. Experience the brilliance and craftsmanship of this timeless piece.';

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await sanityClient.fetch(
                    `*[_type == "product"][0]{
                        "modelVariants": modelVariants[]{
                            cut,
                            weight,
                            setting,
                            mounting,
                            price,
                            isDefault,
                            "modelUrl": modelFile.asset->url
                        }
                    }`
                );
                setProduct(data ?? null);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, []);

    if (loading) {
        return (
            <div className="product-page-loading">
                <div className="spinner"></div>
                <p>Loading Product Data...</p>
            </div>
        );
    }

    return (
        <div className="product-page-container">
            <div className="product-info-column">
                <div className="product-info-content">
                    <h1 className="product-title">{PRODUCT_TITLE}</h1>
                    <p className="product-description">{PRODUCT_DESCRIPTION}</p>
                    <button className="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>

            <div className="product-3d-column">
                <Suspense fallback={
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: 'monospace', zIndex: 5 }}>
                        INITIALIZING ENGINE...
                    </div>
                }>
                    <RingViewer
                        modelUrl={resolveModelVariantUrl(product?.modelVariants ?? [], {
                            cut: 'Brilliant Cut',
                            weight: '1.00ct',
                            setting: 'Classic Band',
                            mounting: 'Classic',
                        })}
                        materialPreset={getMaterialPreset('18KT White Gold')}
                    />
                </Suspense>
                <CaratsLoader />
            </div>
        </div>
    );
}
