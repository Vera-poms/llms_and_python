"""Lab 2: Simple prediction - frequency baselines and linear regression.

Two ways to "predict" something simple:
1. A frequency-based guess (the most common outcome you've seen).
2. A linear regression fit (predict a continuous number from another number).

Fill in the TODOs, then run this file directly.
"""


def most_common_label(labels: list[int]) -> int:
    """Frequency-based prediction: return whichever label (0/1) appears most.

    Args:
        labels: a list of 0/1 labels, e.g. [1, 0, 1, 1, 0]

    Returns:
        The label that occurs most often, e.g. 1. If two labels tie, the one
        that appeared first in the list wins.

    Example:
        most_common_label([1, 0, 1, 1, 0]) -> 1
    """
    # TODO:
    # 1. Make an empty dict and count how many times each label appears.
    # 2. Find the label with the biggest count
    #    (max(counts, key=...) is one way).
    # 3. Return that label.
    raise NotImplementedError("most_common_label() is not implemented yet - replace the TODO with your code")


def linear_regression_fit(x: list[float], y: list[float]) -> tuple[float, float]:
    """Fit y = slope * x + intercept using the least-squares closed form.

    slope = sum((x_i - x_mean) * (y_i - y_mean)) / sum((x_i - x_mean) ** 2)
    intercept = y_mean - slope * x_mean

    Args:
        x: the inputs, e.g. [0, 1, 2]
        y: the matching targets (same length as x), e.g. [1, 3, 5]

    Returns:
        A tuple (slope, intercept) of the best-fit line, e.g. (2.0, 1.0).

    Example:
        linear_regression_fit([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]) -> (2.0, 0.0)
    """
    # TODO:
    # 1. Compute x_mean and y_mean (sum divided by the number of points).
    # 2. Compute the numerator: add up (x_i - x_mean) * (y_i - y_mean) over
    #    all pairs (zip(x, y) walks both lists together).
    # 3. Compute the denominator: add up (x_i - x_mean) ** 2 over all x_i.
    # 4. slope = numerator / denominator, then
    #    intercept = y_mean - slope * x_mean. Return (slope, intercept).
    raise NotImplementedError("linear_regression_fit() is not implemented yet - replace the TODO with your code")


def predict(x: float, slope: float, intercept: float) -> float:
    """Apply the fitted line to a single value of x.

    Args:
        x: one input number, e.g. 6
        slope: the slope of the line, e.g. 2.0
        intercept: the intercept of the line, e.g. 0.0

    Returns:
        The predicted y as a float: slope * x + intercept, e.g. 12.0.

    Example:
        predict(6, 2.0, 0.0) -> 12.0
    """
    # TODO:
    # 1. Multiply slope by x.
    # 2. Add the intercept to that and return the result.
    raise NotImplementedError("predict() is not implemented yet - replace the TODO with your code")


def mean_squared_error(y_true: list[float], y_pred: list[float]) -> float:
    """Average squared difference between true and predicted values.

    Args:
        y_true: the real values, e.g. [2, 4]
        y_pred: the predicted values (same length), e.g. [3, 3]

    Returns:
        The mean of (y_true_i - y_pred_i) ** 2 over all i, e.g. 1.0.
        0 means every prediction was perfect; lower is better.

    Example:
        mean_squared_error([2, 4], [3, 3]) -> 1.0
    """
    # TODO:
    # 1. For each pair (true, predicted), compute true - predicted and
    #    square it (** 2). zip(y_true, y_pred) walks both lists together.
    # 2. Add the squares up and divide by the number of values.
    # 3. Return that average.
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
