type ApiValidationHandler = <T>(error: any, setForm: ReactDispatch<T>) => void

type Response = {
    status: number
    data: {
        results: Result[]
    }
}

type Result = {
    parameter: string
    error: string
}

export const handleApiValidation: ApiValidationHandler = (error, setForm) => {
    const response: Response = error.response
    if (response && response.status === 422) {
        let errors = {}
        response.data.results.map(
            ({ parameter, error }) =>
                (errors = {
                    ...errors,
                    [`${parameter}Error`]: error
                })
        )
        setForm(form => ({
            ...form,
            ...errors
        }))
    }
}