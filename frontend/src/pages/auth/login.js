import { useState } from "react";
// three
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { useTheme } from "@mui/material/styles";
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
import FormProvider, { RHFTextField } from "src/components/hook-form";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routers
import { Paths } from "src/routers/paths";



export default function Login() {
  const theme = useTheme();
  const [errorMsg, setErrorMsg] = useState("");
  const password = useBoolean();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });
  const defaultValues = {
    email: "",
    password: "",
  };
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
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
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h4">Sign in to GYM</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <Link
            component={RouterLink}
            href={Paths.register}
            variant="subtitle2"
          >
            Create an account
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
        <Link
          component={RouterLink}
          href={Paths.register}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ alignSelf: "flex-end" }}
        >
          Forgot password?
        </Link>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        <Divider>or</Divider>
        <LoadingButton
          fullWidth
          color="info"
          size="large"
          startIcon={<Iconify icon="devicon:google" />}
          // type="submit"
          variant="outlined"
          loading={isSubmitting}
        >
          <Typography variant="buttun" color={theme.palette.common.black}>
            Goole Login
          </Typography>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}