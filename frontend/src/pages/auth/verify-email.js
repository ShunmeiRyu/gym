import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
import FormProvider, { RHFCode } from "src/components/hook-form";
// hooks
import { useCountdownSeconds } from "src/hooks/use-countdown";
// routers
import { Paths } from "src/routers/paths";
// api
import { ApiEndpoint } from "src/api/api-endpoint";
import { post } from "src/api/http";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const { countdown, counting, startCountdown } = useCountdownSeconds(60);
  const VerifyEmailSchema = Yup.object().shape({
    code: Yup.string()
      .required("Code is required")
      .length(6, "Code must be length 6"),
  });
  const defaultValues = {
    code: "",
  };
  const methods = useForm({
    resolver: yupResolver(VerifyEmailSchema),
    defaultValues,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (form_data) => {
    const [status, data] = await post(ApiEndpoint.verify_email, {
      email: params.get("email"),
      code: form_data.code,
    });
    if (status === 200) {
      navigate(Paths.login);
    } else {
      setErrorMsg(data.message);
    }
  };
  const handleResendCode = async (form_data) => {
    const [status, data] = await post(ApiEndpoint.register_resend_code, {
      email: params.get("email"),
    });
    if (status === 200) {
      console.log(111,form_data)
      navigate(`${Paths.verify_email}?email=${params.get("email")}`);
    } else {
      setErrorMsg(data.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          We have emailed a 6-digit confirmation code to acb@domain, please
          enter the code in below box to verify your email.
        </Typography>
      </Stack>

      <Stack spacing={2.5} justifyContent="center" alignItems="center">
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFCode name="code" />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Active account
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
