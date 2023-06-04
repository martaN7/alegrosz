import { useFormik } from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Alert,
    FormControl,
    InputLabel,
    Select,
    TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DropInput from '../DropInput.tsx';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Product, ProductWithoutId } from '../../types/product.ts';

// [{id, name, subcategories: [{id, name}]}]

interface Kind {
    id: number;
    name: string;
}

interface Category extends Kind {
    subcategories: Array<Kind | undefined>;
}

interface CategoryApi extends Kind {
    subcategories: number[];
}

async function getKind<T>(endpoint: string): Promise<T[]> {
    const response = await fetch(`/api/v1/${endpoint}`);
    return response.json();
}

async function getCategoriesWithSubcategories(): Promise<Category[]> {
    const response = await Promise.all([
        getKind<CategoryApi>('categories'),
        getKind<Kind>('subcategories'),
    ]);

    const [categories, subcategories] = response;

    return categories.map((category) => ({
        ...category,
        subcategories: category.subcategories.map((subcategoryId) =>
            subcategories.find(
                (subcategory) => subcategory.id === subcategoryId
            )
        ),
    }));
}

async function addProduct(
    endpoint: string,
    product: ProductWithoutId
): Promise<Product> {
    const response = await fetch(`/api/v1/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });

    return response.json();
}

function delay(
    timer: number,
    fn: NavigateFunction,
    arg: string
): Promise<number> {
    return new Promise((resolve) => {
        const interval = window.setTimeout(() => {
            fn(arg);
        }, timer);
        resolve(interval);
    });
}

function ProductForm() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeSubcategories, setActiveSubcategories] = useState<Kind[]>([]);

    const [isMessage, setIsMessage] = useState(false);
    const [productId, setProductId] = useState<number | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        getCategoriesWithSubcategories().then(setCategories);
    }, []);

    useEffect(() => {
        let intervalId: number | undefined;

        if (isMessage) {
            delay(5000, navigate, `/products/${productId}`).then((interval) => {
                intervalId = interval;
            });
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [isMessage, navigate, productId]);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            image: '',
            stockCount: 0,
            barcode: '',
            category: 0,
            subcategory: 0,
        },
        onSubmit: async (values) => {
            const product = await addProduct('products', values);
            setIsMessage(true);
            setProductId(product.id);
        },
    });

    function updateSubcategories(selectedCategory: number) {
        if (selectedCategory === 0) {
            setActiveSubcategories([]);
        }

        const selectedCategoryObj = categories.find(
            (category) => category.id === selectedCategory
        );

        if (selectedCategoryObj !== undefined) {
            const subcategoriesFiltered =
                selectedCategoryObj.subcategories.filter(Boolean) as Kind[];
            setActiveSubcategories(subcategoriesFiltered);
        }
    }

    return (
        <Box sx={{ my: '20px' }}>
            {isMessage && (
                <Alert severity="success" sx={{ marginBottom: '20px' }}>
                    Product has been added.
                </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid xs={12}>
                        <TextField
                            fullWidth={true}
                            id="name"
                            label="Name"
                            variant="filled"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            multiline
                            fullWidth={true}
                            id="description"
                            label="Description"
                            variant="filled"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth={true}
                            id="price"
                            label="Price"
                            variant="filled"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <DropInput />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth={true}
                            id="stockCount"
                            label="Stock Count"
                            variant="filled"
                            type="number"
                            value={formik.values.stockCount}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth={true}
                            id="barcode"
                            label="Barcode"
                            variant="filled"
                            value={formik.values.barcode}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="categoryLbl">Category</InputLabel>
                            <Select
                                labelId="categoryLbl"
                                id="category"
                                value={formik.values.category}
                                label="Category"
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    updateSubcategories(
                                        e.target.value as number
                                    );
                                    formik.values.subcategory = 0;
                                }}
                                name="category"
                            >
                                <MenuItem value={0}>---</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem
                                        value={category.id}
                                        key={category.id}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="subcategoryLbl">
                                Subcategory
                            </InputLabel>
                            <Select
                                labelId="subcategoryLbl"
                                id="subcategory"
                                name="subcategory"
                                value={formik.values.subcategory}
                                label="Subcategory"
                                onChange={formik.handleChange}
                                disabled={!activeSubcategories.length}
                            >
                                <MenuItem value={0}>---</MenuItem>
                                {activeSubcategories.map((subcategory) => (
                                    <MenuItem
                                        key={subcategory.id}
                                        value={subcategory.name}
                                    >
                                        {subcategory.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12}>
                        <Button variant="contained" type="submit">
                            Add product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default ProductForm;
