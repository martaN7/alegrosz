import { useFormik } from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import { FormControl, InputLabel, Select, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DropInput from '../DropInput.tsx';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';

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

function ProductForm() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeSubcategories, setActiveSubcategories] = useState<Kind[]>([]);

    useEffect(() => {
        getCategoriesWithSubcategories().then(setCategories);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            image: '',
            stockCount: 0,
            barcode: '',
            category: '0',
            subcategory: '0',
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    function updateSubcategories(selectedCategory: string) {
        const selectedCategoryObj = categories.find(
            (category) => category.name === selectedCategory
        );

        if (selectedCategoryObj !== undefined) {
            const subcategoriesFiltered =
                selectedCategoryObj.subcategories.filter(Boolean) as Kind[];
            setActiveSubcategories(subcategoriesFiltered);
        }
    }

    return (
        <Box sx={{ mt: '20px' }}>
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
                                    updateSubcategories(e.target.value);
                                    formik.values.subcategory = '0';
                                }}
                                name="category"
                            >
                                <MenuItem value="0">---</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.name}
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
                                value={formik.values.subcategory}
                                label="Subcategory"
                                onChange={formik.handleChange}
                                name="subcategory"
                            >
                                <MenuItem value="0">---</MenuItem>
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
