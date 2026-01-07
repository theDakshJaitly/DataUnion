# Sensor Scoring Debug Guide

## Issue
Data Precision and Temporal/Sampling scores showing 0/100 when they should have values.

## Likely Causes

### Data Precision = 0
**Problem:** Not detecting decimal numbers properly

**Possible reasons:**
1. All numeric values are integers (no decimals)
2. Nested object structure - values are inside `device_info` or similar
3. Numbers stored as strings instead of actual numbers

**Example problematic data:**
```json
{
  "device_info": {
    "sensor_id": "SN-8842-XJ",
    "temperature": "22.5"  ← String, not number!
  }
}
```

### Temporal/Sampling = 0
**Problem:** Not detecting timestamp fields

**Possible reasons:**
1. Timestamp field has different name (e.g., `created_at`, `recorded_time`)
2. Timestamp is nested inside an object
3. Field name doesn't match our detection list

**Current detection list:**
- `timestamp`
- `time`
- `datetime`
- `date`
- `ts`

## How to Debug

1. **Open Browser Console** (F12)
2. **Submit sensor data**
3. **Look for these logs:**
   ```
   Analyzing sensor data quality with enhanced detection...
   Enhanced sensor analysis complete: { quality, qualityBreakdown, ... }
   ```

4. **Check the data structure** in the console output

## Quick Fix Options

### Option 1: Flatten nested data
If data is nested, extract values to top level before analysis

### Option 2: Expand timestamp detection
Add more field name variations:
- `created_at`, `updated_at`
- `recorded_time`, `capture_time`
- `epoch`, `unix_time`

### Option 3: Handle string numbers
Convert string numbers to actual numbers before analysis

## Need from User
Please share:
1. Exact JSON sensor data being submitted
2. Console logs from the submission
3. Screenshot of the scores showing 0
