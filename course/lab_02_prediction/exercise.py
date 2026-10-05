"""Lab 2: Simple prediction - frequency baselines and linear regression.

Two ways to "predict" something simple:
1. A frequency-based guess (the most common outcome you've seen).
2. A linear regression fit (predict a continuous number from another number).

Fill in the TODOs, then run this file directly.
"""


def most_common_label(labels: list[int]) -> int:
    """Frequency-based prediction: return whichever label (0/1) appears most."""
    # TODO: count occurrences of each label and return the most frequent one.
    raise NotImplementedError("most_common_label() is not implemented yet - replace the TODO with your code")


def linear_regression_fit(x: list[float], y: list[float]) -> tuple[float, float]:
    """Fit y = slope * x + intercept using the least-squares closed form.

    slope = sum((x_i - x_mean) * (y_i - y_mean)) / sum((x_i - x_mean) ** 2)
    intercept = y_mean - slope * x_mean
    """
    # TODO: implement the formulas above using x and y.
    raise NotImplementedError("linear_regression_fit() is not implemented yet - replace the TODO with your code")


def predict(x: float, slope: float, intercept: float) -> float:
    # TODO: apply the fitted line to a single value of x.
    raise NotImplementedError("predict() is not implemented yet - replace the TODO with your code")


def mean_squared_error(y_true: list[float], y_pred: list[float]) -> float:
    # TODO: average of (y_true_i - y_pred_i) ** 2 over all i.
    raise NotImplementedError("mean_squared_error() is not implemented yet - replace the TODO with your code")


if __name__ == "__main__":
    assert most_common_label([1, 0, 1, 1, 0]) == 1, 'most_common_label([1, 0, 1, 1, 0]) should be ' + repr(1) + ", got " + repr(most_common_label([1, 0, 1, 1, 0]))

    x = [1, 2, 3, 4, 5]
    y = [2, 4, 6, 8, 10]
    slope, intercept = linear_regression_fit(x, y)
    assert abs(slope - 2.0) < 1e-9, 'slope should be about ' + repr(2.0) + ", got " + repr(slope)
    assert abs(intercept - 0.0) < 1e-9, 'intercept should be about ' + repr(0.0) + ", got " + repr(intercept)
    assert abs(predict(6, slope, intercept) - 12.0) < 1e-9, 'predict(6, slope, intercept) should be about ' + repr(12.0) + ", got " + repr(predict(6, slope, intercept))

    mse = mean_squared_error([1, 2, 3], [1, 2, 3])
    assert mse == 0, 'mse should be ' + repr(0) + ", got " + repr(mse)

    print("All checks passed.")
