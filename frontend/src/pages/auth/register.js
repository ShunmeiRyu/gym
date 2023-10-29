import { useState } from "react";
import { useNavigate } from "react-router-dom";
// three
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
// components
import RouterLink from "src/components/router-link";
import Iconify from "src/components/iconify/iconify";
import FormProvider , { RHFTextField } from "src/components/hook-form";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routers
import { Paths } from "src/routers/paths";
// api
import { ApiEndpoint } from "src/api/api-endpoint";
import { post } from "src/api/http";

export default function Register() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const password = useBoolean();
  const confirm_password = useBoolean();
  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const defaultValues = {
    email: "",
    password: "",
    confirm_password: "",
  };
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (form_data) => {
    const [status, data] = await post(ApiEndpoint.register, {
      email: form_data.email,
      password: form_data.password,
    });
    if (status === 200) {
      navigate(`${Paths.verify_email}?email=${form_data.email}`);
    } else {
      setErrorMsg(data.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} >
        <Stack spacing={2} sx={{ mb: 5 }}>
          <Typography variant="h4">Sign up to GYM</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">Already have an account?</Typography>

            <Link component={RouterLink} href={Paths.login} variant="subtitle2">
              Sign in
            </Link>
          </Stack>
        </Stack>

        <Stack spacing={2.5}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <RHFTextField name="email" label="Email address" />

          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify
                      icon={
                        password.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirm_password"
            label="Confirm password"
            type={confirm_password.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={confirm_password.onToggle} edge="end">
                    <Iconify
                      icon={
                        confirm_password.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create account
          </LoadingButton>
        </Stack>
        <Typography
          component="div"
          sx={{
            color: "text.secondary",
            mt: 2.5,
            typography: "caption",
            textAlign: "start",
          }}
        >
          {"By signing up, I agree to "}
          <Link underline="always" color="text.primary">
            Privacy Policy
          </Link>
          .
        </Typography>
    </FormProvider>
  );
}
