import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '../../types/product.ts';
import { useEffect, useState } from 'react';
import { Loader } from '../Feedback/Loader.tsx';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Card, CardMedia, Paper } from '@mui/material';
import { faker } from '@faker-js/faker';

async function getProduct(
    endpoint: string,
    signal: AbortSignal
): Promise<Product> {
    const response = await fetch(`/api/v1/${endpoint}`, { signal });
    return response.json();
}

async function deleteProduct(endpoint: string): Promise<Record<string, never>> {
    const response = await fetch(`/api/v1/${endpoint}`, {
        method: 'DELETE',
    });
    return response.json();
}

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        if (id !== undefined) {
            getProduct(`products/${id}`, controller.signal).then(setProduct);
        } else {
            // TODO: create error boundary for this component
            throw new Error(`Invalid query params id: ${id}`);
        }

        return () => {
            controller.abort();
        };
    }, [id]);

    async function handleDelete() {
        await deleteProduct(`products/${id}`);
        navigate(`/`, {
            state: {
                productName: product?.name as string,
                deleted: true,
            },
        });
    }

    if (!product) {
        return <Loader />;
    }

    return (
        <Box sx={{ my: '20px' }}>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Typography variant="h1" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {product.category}/{product.subcategory}
                    </Typography>
                    <Grid container spacing={2} xs={12}>
                        <Grid item xs={6}>
                            <Card sx={{ maxWidth: 645 }}>
                                <CardMedia
                                    sx={{ height: 440 }}
                                    image={faker.image.urlLoremFlickr({
                                        category: 'technics',
                                    })}
                                    title={product.name}
                                />
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={1} sx={{ p: '5px', mb: 4 }}>
                                <Typography variant="body1">
                                    {product.description}
                                </Typography>
                            </Paper>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: '5px',
                                    display: 'flex',
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h4">
                                    price: ${product.price}
                                </Typography>
                                <Button variant="contained">Buy now</Button>
                            </Paper>
                            <Paper sx={{ display: 'flex', gap: 2, p: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleDelete}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ProductDetails;
