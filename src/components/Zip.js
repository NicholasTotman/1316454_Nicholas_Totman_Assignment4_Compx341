import React, { useState } from 'react';

export function Zip(props) {

    const [validationError, setValidationError] = useState(null);

    const validate = (event) => {
        const cityPattern = /[a-zA-Z]+/g;
        const valid = cityPattern// true;  //cityPattern.test(event.target.value);
        if (!valid) {
            setValidationError('* should be a valid city name only');
            props.clearResponse();
        } else {
            setValidationError('');
            props.onZipChange(event.target.value);
        }
    };

    return (
        <div className="col-sm-4">
            <div className="row">
                <div className="col-sm-10">
                    <style jsx="true">{`
                        .form-control::-webkit-input-placeholder {
                            color: #ddd;
                        }
                    `}
                    </style>
                    <input
                        type="text"
                        className="form-control"
                        id="usr"
                        placeholder="NZ City:"
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                validate(event);
                            }
                        }}
                        onFocus={(event) => {
                            if (event.target.value !== "") {
                                validate(event);
                            }

                        }}
                    ></input>
                </div>
            </div>
            <div className="pl-3 row">
                <div className="text-danger small"> {validationError}</div>
            </div>
        </div>
    );
}

export default Zip