"""Lab 2 solution."""


def most_common_label(labels: list[int]) -> int:
    counts: dict[int, int] = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return max(counts, key=lambda label: counts[label])


def linear_regression_fit(x: list[float], y: list[float]) -> tuple[float, float]:
    n = len(x)
    x_mean = sum(x) / n
    y_mean = sum(y) / n
    numerator = sum((xi - x_mean) * (yi - y_mean) for xi, yi in zip(x, y))
    denominator = sum((xi - x_mean) ** 2 for xi in x)
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    return slope, intercept


def predict(x: float, slope: float, intercept: float) -> float:
    return slope * x + intercept


def mean_squared_error(y_true: list[float], y_pred: list[float]) -> float:
    n = len(y_true)
    return sum((yt - yp) ** 2 for yt, yp in zip(y_true, y_pred)) / n


if __name__ == "__main__":
    x = [1, 2, 3, 4, 5]
    y = [2, 4, 6, 8, 10]
    slope, intercept = linear_regression_fit(x, y)
    print(f"slope={slope}, intercept={intercept}")
