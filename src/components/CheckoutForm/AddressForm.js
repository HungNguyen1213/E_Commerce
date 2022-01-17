import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { commerce } from "../../lib/commerce";
import { Link } from "react-router-dom";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  TextField,
} from "@material-ui/core";

import FormInput from "./CustomTextField";

function AddressForm({ checkoutToken, next }) {
  const methods = useForm();
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  useEffect(() => {
    checkoutToken && fetchShippingCountries(checkoutToken.id);
  }, [checkoutToken]);

  useEffect(() => {
    shippingCountry && fetchSubdivisions(checkoutToken.id, shippingCountry);
  }, [checkoutToken, shippingCountry]);

  useEffect(() => {
    shippingSubdivision &&
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubdivision
      );
  }, [checkoutToken, shippingCountry, shippingSubdivision]);

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (checkoutTokenId, countryCode) => {
    const { subdivisions } =
      await commerce.services.localeListShippingSubdivisions(
        checkoutTokenId,
        countryCode
      );
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    countryCode,
    regionCode
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country: countryCode, region: regionCode }
    );
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              shippingCountry,
              shippingSubdivision,
              shippingOption,
            })
          )}
        >
          <Grid container spacing={3}>
            <FormInput
              required
              name="firstName"
              render={() => {
                return <TextField label="First name" required />;
              }}
            />
            <FormInput
              required
              name="lastName"
              render={() => {
                return <TextField label="Last name" required />;
              }}
            />
            <FormInput
              required
              name="address1"
              render={() => {
                return <TextField label="Address" required />;
              }}
            />
            <FormInput
              required
              name="email"
              render={() => {
                return <TextField label="Email" required />;
              }}
            />
            <FormInput
              required
              name="city"
              render={() => {
                return <TextField label="City" required />;
              }}
            />
            <FormInput
              required
              name="zip"
              render={() => {
                return <TextField label="ZIP / Postal code" required />;
              }}
            />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {Object.entries(shippingCountries)
                  .map(([code, name]) => ({ id: code, label: name }))
                  .map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => setShippingSubdivision(e.target.value)}
              >
                {Object.entries(shippingSubdivisions)
                  .map(([code, name]) => ({ id: code, label: name }))
                  .map((subdivision) => (
                    <MenuItem key={subdivision.id} value={subdivision.id}>
                      {subdivision.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {shippingOptions
                  .map(({ id, description, price }) => ({
                    id,
                    description,
                    price: price.formatted_with_symbol,
                  }))
                  .map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {`${option.description} - ${option.price}`}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} to="/cart" variant="outlined">
              Back to Cart
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export default AddressForm;
