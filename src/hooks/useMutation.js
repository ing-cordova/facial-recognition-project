import axios from 'axios'
import { useCallback, useMemo, useState } from 'react';
import config from '../config/index'

const { baseUrl } = config;

const defaultOptions = {
    method: 'post', // post | put | delete,
    variables: null,
    refresh: null,
    headers: {}
};

const useMutation = (url, opts = defaultOptions) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState(null);

    const optsResolve = useMemo(() => {
        return {
            ...defaultOptions,
            ...opts
        };
    }, [opts]);

    const mutationFunc = useCallback(
        async (optsFunc = {}, id = '') => {
            const options = {
                ...optsResolve,
                ...optsFunc
            };

            setLoading(true);

            try {
                const path = `${baseUrl}${url}/${id}`;
                const config =
                    options.method === 'delete'
                        ? [{ data: options.variables, headers: options.headers }]
                        : [options.variables, { headers: options.headers }];

                const { data } = await axios[options.method](path, ...config);
                setData(data);
                setLoading(false);
                if (options.refresh && typeof options.refresh === 'function') {
                    await options.refresh();
                }
                return { data, loading: false, errors: null };
            } catch (err) {
                console.log(err);
                setErrors(err);
                setData(null);
                setLoading(false);
                return { data: null, loading: false, errors: err };
            }
        },
        [url, optsResolve]
    );

    return [mutationFunc, { loading, data, errors }];
};

export default useMutation;
