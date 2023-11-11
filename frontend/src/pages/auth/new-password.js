import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// three
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
// components
import RouterLink from "src/components/router-link";
import Iconify from "src/components/iconify/iconify";
import FormProvider, { RHFCode, RHFTextField } from "src/components/hook-form";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
import { useCountdownSeconds } from "src/hooks/use-countdown";
// routers
import { Paths } from "src/routers/paths";
// api
import { ApiEndpoint } from "src/api/api-endpoint";
import axiosHttp from "src/api/http";

export default function NewPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const password = useBoolean();
  const confirm_password = useBoolean();
  const { countdown, counting, startCountdown } = useCountdownSeconds(60);
  const NewPasswordSchema = Yup.object().shape({
    code: Yup.string().required("Code is required").length(6),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });
  const defaultValues = {
    code: "",
    password: "",
    confirm_password: "",
  };
  const methods = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (form_data) => {
    const [status, data] = await axiosHttp.post(ApiEndpoint.password_verify_email, {
      email: params.get("email"),
      code: form_data.code,
      password: form_data.password,
    });
    if (status === 200) {
      navigate("/");
    } else {
      setErrorMsg(data.message);
    }
  };
  const handleResendCode = async (form_data) => {
    const [status, data] = await axiosHttp.post(ApiEndpoint.forgot_password, {
      email: params.get("email"),
    });
    if (status === 200) {
      navigate(`${Paths.new_password}?email=${params.get("email")}`);
    } else {
      setErrorMsg(data.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Request sent successfully!</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          We&apos;ve sent a 6-digit confirmation email to your email. Please
          enter the code in below box to verify your email and set password.
        </Typography>
      </Stack>

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2.5}
      >
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFCode name="code" />

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
          Update Password
        </LoadingButton>
        <Typography variant="body2" textAlign="center">
          {`Don’t have a code? `}
          <Link
            variant="subtitle2"
            onClick={handleResendCode}
            sx={{
              cursor: "pointer",
              ...(counting && {
                color: "text.disabled",
                pointerEvents: "none",
              }),
            }}
          >
            Resend code {counting && `(${countdown}s)`}
          </Link>
        </Typography>

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
