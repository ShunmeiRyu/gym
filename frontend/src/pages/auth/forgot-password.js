import { useState } from "react";
// three
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
// components
import RouterLink from "src/components/router-link";
import Iconify from "src/components/iconify/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
// routers
import { Paths } from "src/routers/paths";

export default function ForgotPassword() {
  const [errorMsg, setErrorMsg] = useState("");
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
  });
  const defaultValues = {
    email: "",
  };
  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
    } catch (error) {}
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please enter the email address associated with your account and We
          will email you a link to reset your password.
        </Typography>
      </Stack>

      <Stack spacing={2.5} justifyContent="center" alignItems="center">
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send email
        </LoadingButton>

        <Link
          component={RouterLink}
          href={Paths.login}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          Return to sign in
        </Link>
      </Stack>
    </FormProvider>
  );
}
