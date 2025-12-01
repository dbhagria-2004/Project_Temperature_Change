import pandas as pd
import matplotlib.pyplot as plt

noaa = pd.read_csv("NOAA_GlobalData.csv", comment='#')
noaa = noaa[(noaa["Year"] >= 1924) & (noaa["Year"] <= 2024)]

early = noaa[(noaa["Year"] >= 1924) & (noaa["Year"] <= 1974)]
late = noaa[(noaa["Year"] >= 1975) & (noaa["Year"] <= 2024)]

plt.figure(figsize=(10, 6))

plt.hist(early["Anomaly"], bins=10, alpha=0.5, edgecolor="black", density=True, label="1924–1974: Early Industrial/Post-War")
plt.hist(late["Anomaly"], bins=10, alpha=0.5, edgecolor="black", density=True, label="1975–2024: Modern Warming Era")

plt.axvline(early["Anomaly"].mean(), color="blue", linestyle="--", linewidth=2)
plt.axvline(late["Anomaly"].mean(), color="red", linestyle="--", linewidth=2)

plt.title("Distribution of Global Temperature Anomalies\nEarly vs Modern Warming Era (NOAA 1924–2024)")
plt.xlabel("Temperature Anomaly (°C)")
plt.ylabel("Density")
plt.legend()
plt.tight_layout()
plt.savefig("noaa_distribution_1924_2024.png", dpi=300)
plt.show()
