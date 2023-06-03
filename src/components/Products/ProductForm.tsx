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
    subcategories: Kind[];
}

async function getKind(endpoint: string) {
    const response = await fetch(`/api/v1/${endpoint}`);
    return response.json();
}

async function getCategriesWithSubcategories() {
    const response = await Promise.all([
        getKind('categories'),
        getKind('subcategories'),
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

    useEffect(() => {
        getCategriesWithSubcategories().then(setCategories);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            image: '',
            stockCount: 0,
            barcode: '',
            category: '',
            subcategory: '',
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

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
                                onChange={formik.handleChange}
                                name="category"
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
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
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
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
