import React from "react";
import { Grid } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

function FormInput({ name, required, render }) {
  const { control } = useFormContext();
  return (
    <Grid item xs={12} sm={6}>
      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={render}
      />
    </Grid>
  );
}

export default FormInput;
