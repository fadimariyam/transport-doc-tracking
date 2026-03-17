const calcStatus = (current, last, interval) => {
  if (!current || !last || !interval)
    return "Normal";

  const next = last + interval;

  if (current > next) return "Expired";

  if (current >= next - 500) return "Soon";

  return "Normal";
};

module.exports = calcStatus;