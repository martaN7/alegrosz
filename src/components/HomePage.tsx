import Grid from '@mui/material/Grid';
import {
    Alert,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Product, ProductWithCategories } from '../types/product.ts';
import { ApiType } from '../types/api.ts';
import { CategoryApi, Kind } from '../types/category.ts';
import { Search } from './Inputs/Search.tsx';
import ProductList from './Products/ProductList.tsx';
import MenuItem from '@mui/material/MenuItem';

async function getData<T>({ endpoint, signal }: ApiType): Promise<T[]> {
    const init: { signal?: AbortSignal } = {};

    if (signal !== undefined) {
        init.signal = signal;
    }

    const response = await fetch(`/api/v1/${endpoint}`, init);
    return response.json();
}

async function getProductsWithCategories(
    signal: AbortSignal
): Promise<ProductWithCategories[]> {
    const response = await Promise.all([
        getData<Product>({ endpoint: 'products', signal }),
        getData<CategoryApi>({ endpoint: 'categories', signal }),
        getData<Kind>({ endpoint: 'subcategories', signal }),
    ]);

    const [products, categories, subcategories] = response;

    return products.map((product) => ({
        ...product,
        category: categories.find(
            (category) => product.category === category.id
        ),
        subcategory: subcategories.find(
            (subcategory) => product.subcategory === subcategory.id
        ),
    }));
}

function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState<ProductWithCategories[]>([]);
    const [query, setQuery] = useState('');
    const [sortParam, setSortParam] = useState<string>(
        searchParams.get('sortBy') || ''
    );

    const location = useLocation();
    const [msg, setMsg] = useState<boolean | undefined>(
        location.state?.deleted
    );

    useEffect(() => {
        const controller = new AbortController();
        getProductsWithCategories(controller.signal).then(setProducts);

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        // TODO: create query params for search products
        const queryParams: { sortBy?: string } = {};

        if (sortParam) {
            queryParams.sortBy = sortParam;
        }

        setSearchParams(queryParams);
    }, [sortParam]);

    // TODO: create loader

    function handleSortPrice(e: SelectChangeEvent) {
        setSortParam(e.target.value);
    }

    return (
        <Box sx={{ my: '20px' }}>
            <Grid spacing={2} container>
                <Grid item xs={12}>
                    {/* TODO: doesn't disappear on reload */}
                    {msg && (
                        <Alert
                            severity="success"
                            onClose={() => {
                                setMsg(false);
                            }}
                            sx={{ marginBottom: '20px' }}
                        >
                            Product: {location.state.productName} has been
                            deleted.
                        </Alert>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Search value={query} setQuery={setQuery} />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel id="priceSortingLabel">
                            Sort by price
                        </InputLabel>
                        <Select
                            labelId="priceSortingLabel"
                            id="priceSorting"
                            value={sortParam}
                            label="Sort by price"
                            onChange={handleSortPrice}
                        >
                            <MenuItem value={''}>---</MenuItem>
                            <MenuItem value={'asc'}>Ascending</MenuItem>
                            <MenuItem value={'desc'}>Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container spacing={2}>
                    <ProductList
                        products={products}
                        query={query}
                        sortParam={sortParam}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomePage;
